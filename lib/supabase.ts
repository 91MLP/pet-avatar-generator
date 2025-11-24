import { createClient } from '@supabase/supabase-js'

// 客户端 Supabase 实例（用于浏览器端）
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// 服务端 Supabase 实例（用于 API 路由）
export function createServerSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
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
