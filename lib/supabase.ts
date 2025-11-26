import { createClient, SupabaseClient } from '@supabase/supabase-js'

// 获取环境变量，提供占位符以避免构建时错误
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

// 客户端 Supabase 实例（用于浏览器端）
let supabaseInstance: SupabaseClient | null = null

export const supabase = (() => {
  if (!supabaseInstance) {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey)
  }
  return supabaseInstance
})()

// 服务端 Supabase 实例（用于 API 路由）
export function createServerSupabaseClient() {
  return createClient(supabaseUrl, supabaseAnonKey)
}

// 数据库类型定义
export interface Generation {
  id: string
  user_id: string
  user_email?: string
  breed: string
  style: string
  preview_urls: string[]
  hd_urls?: string[]
  paid: boolean
  payment_id?: string
  amount?: number
  created_at: string
  updated_at: string
}

// 插入新的生成记录
export async function createGeneration(data: {
  user_id: string
  user_email?: string
  breed: string
  style: string
  preview_urls: string[]
  hd_urls?: string[]
  paid?: boolean
  payment_id?: string
  amount?: number
}) {
  const { data: generation, error } = await supabase
    .from('generations')
    .insert([data])
    .select()
    .single()

  if (error) {
    console.error('Error creating generation:', error)
    throw error
  }

  return generation as Generation
}

// 获取用户的所有生成记录
export async function getUserGenerations(userId: string) {
  const { data, error } = await supabase
    .from('generations')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching generations:', error)
    throw error
  }

  return data as Generation[]
}

// 更新生成记录（例如支付后添加高清图）
export async function updateGeneration(
  id: string,
  updates: {
    hd_urls?: string[]
    paid?: boolean
    payment_id?: string
    amount?: number
  }
) {
  const { data, error } = await supabase
    .from('generations')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating generation:', error)
    throw error
  }

  return data as Generation
}

// 获取单个生成记录
export async function getGeneration(id: string) {
  const { data, error } = await supabase
    .from('generations')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching generation:', error)
    throw error
  }

  return data as Generation
}

// 删除用户的所有生成记录
export async function deleteAllUserGenerations(userId: string) {
  try {
    console.log('Deleting all generations for user:', userId)

    const { data, error } = await supabase
      .from('generations')
      .delete()
      .eq('user_id', userId)
      .select()

    if (error) {
      console.error('Error deleting all user generations:', error)
      throw new Error(`Database error: ${error.message}`)
    }

    console.log(`Successfully deleted ${data?.length || 0} generations for user ${userId}`)

    return {
      success: true,
      deletedCount: data?.length || 0,
    }
  } catch (error) {
    console.error('Unexpected error in deleteAllUserGenerations:', error)
    throw error
  }
}
