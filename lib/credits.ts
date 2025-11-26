import { supabase } from './supabase'

// 积分交易类型
export type TransactionType = 'purchase' | 'reward' | 'generation' | 'refund'

// 用户积分接口
export interface UserCredits {
  id: string
  user_id: string
  credits: number
  created_at: string
  updated_at: string
}

// 积分交易记录接口
export interface CreditTransaction {
  id: string
  user_id: string
  amount: number
  type: TransactionType
  description: string
  related_id?: string
  stripe_payment_id?: string
  created_at: string
}

// 初始赠送积分数量
const INITIAL_CREDITS = 3

// 生成高清图需要的积分（已弃用，现在基于风格）
export const CREDITS_PER_HD_GENERATION = 1

// 不同风格消耗的积分
export const CREDITS_PER_STYLE: Record<string, number> = {
  cute: 1,    // 萌系风格 - 标准
  chibi: 2,   // 贴纸风格 - 高级
  kawaii: 3,  // 日系风格 - 专业
}

/**
 * 获取生成指定风格所需的积分
 */
export function getCreditsForStyle(style: string): number {
  return CREDITS_PER_STYLE[style] || CREDITS_PER_STYLE.cute
}

// 积分价格配置（美分）
export const CREDIT_PACKAGES = [
  { credits: 10, price: 999, label: '10 积分', popular: false },
  { credits: 30, price: 2499, label: '30 积分', popular: true },
  { credits: 100, price: 6999, label: '100 积分', popular: false },
]

/**
 * 获取用户积分余额
 */
export async function getUserCredits(userId: string): Promise<number> {
  try {
    const { data, error } = await supabase
      .from('user_credits')
      .select('credits')
      .eq('user_id', userId)
      .single()

    if (error) {
      // 如果用户不存在，创建账户并赠送初始积分
      if (error.code === 'PGRST116') {
        await initializeUserCredits(userId)
        return INITIAL_CREDITS
      }
      throw error
    }

    return data?.credits || 0
  } catch (error) {
    console.error('Error getting user credits:', error)
    throw error
  }
}

/**
 * 初始化用户积分账户（新用户注册时调用）
 */
export async function initializeUserCredits(userId: string): Promise<UserCredits> {
  try {
    // 创建用户积分记录
    const { data: creditsData, error: creditsError } = await supabase
      .from('user_credits')
      .insert([{ user_id: userId, credits: INITIAL_CREDITS }])
      .select()
      .single()

    if (creditsError) {
      // 如果记录已存在（竞态条件），直接查询并返回现有记录
      if (creditsError.code === '23505') {
        const { data: existingData, error: fetchError } = await supabase
          .from('user_credits')
          .select('*')
          .eq('user_id', userId)
          .single()

        if (fetchError) throw fetchError
        return existingData as UserCredits
      }
      throw creditsError
    }

    // 记录初始赠送交易
    await supabase.from('credit_transactions').insert([
      {
        user_id: userId,
        amount: INITIAL_CREDITS,
        type: 'reward',
        description: '新用户注册赠送',
      },
    ])

    return creditsData as UserCredits
  } catch (error) {
    console.error('Error initializing user credits:', error)
    throw error
  }
}

/**
 * 检查用户是否有足够的积分
 */
export async function hasEnoughCredits(
  userId: string,
  requiredCredits: number
): Promise<boolean> {
  const currentCredits = await getUserCredits(userId)
  return currentCredits >= requiredCredits
}

/**
 * 扣除积分（用于生成高清图）
 */
export async function deductCredits(
  userId: string,
  amount: number,
  relatedId?: string
): Promise<{ success: boolean; remainingCredits: number }> {
  try {
    // 检查余额
    const currentCredits = await getUserCredits(userId)
    if (currentCredits < amount) {
      return { success: false, remainingCredits: currentCredits }
    }

    // 扣除积分
    const newCredits = currentCredits - amount
    const { error: updateError } = await supabase
      .from('user_credits')
      .update({ credits: newCredits })
      .eq('user_id', userId)

    if (updateError) throw updateError

    // 记录交易
    await supabase.from('credit_transactions').insert([
      {
        user_id: userId,
        amount: -amount,
        type: 'generation',
        description: `生成高清图消费 ${amount} 积分`,
        related_id: relatedId,
      },
    ])

    return { success: true, remainingCredits: newCredits }
  } catch (error) {
    console.error('Error deducting credits:', error)
    throw error
  }
}

/**
 * 增加积分（用于充值）
 */
export async function addCredits(
  userId: string,
  amount: number,
  stripePaymentId?: string,
  relatedId?: string
): Promise<{ success: boolean; newBalance: number }> {
  try {
    // 获取当前积分
    const currentCredits = await getUserCredits(userId)
    const newCredits = currentCredits + amount

    // 更新积分
    const { error: updateError } = await supabase
      .from('user_credits')
      .update({ credits: newCredits })
      .eq('user_id', userId)

    if (updateError) throw updateError

    // 记录交易
    await supabase.from('credit_transactions').insert([
      {
        user_id: userId,
        amount: amount,
        type: 'purchase',
        description: `购买 ${amount} 积分`,
        related_id: relatedId,
        stripe_payment_id: stripePaymentId,
      },
    ])

    return { success: true, newBalance: newCredits }
  } catch (error) {
    console.error('Error adding credits:', error)
    throw error
  }
}

/**
 * 获取用户的积分交易历史
 */
export async function getUserTransactions(
  userId: string,
  limit: number = 50
): Promise<CreditTransaction[]> {
  try {
    const { data, error } = await supabase
      .from('credit_transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) throw error

    return (data || []) as CreditTransaction[]
  } catch (error) {
    console.error('Error getting user transactions:', error)
    throw error
  }
}
