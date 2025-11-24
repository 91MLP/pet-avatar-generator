import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createGeneration, getUserGenerations } from '@/lib/supabase'

// POST /api/generations - 创建新的生成记录
export async function POST(request: NextRequest) {
  try {
    // 验证用户身份
    const authResult = await auth()
    const userId = authResult.userId

    console.log('Auth result:', { userId, sessionId: authResult.sessionId })

    if (!userId) {
      console.error('No userId found in auth result:', authResult)
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // 解析请求体
    const body = await request.json()
    const { breed, style, preview_urls, hd_urls, paid, payment_id, amount, user_email } = body

    // 验证必填字段
    if (!breed || !style || !preview_urls || !Array.isArray(preview_urls)) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // 创建生成记录
    const generation = await createGeneration({
      user_id: userId,
      user_email,
      breed,
      style,
      preview_urls,
      hd_urls: hd_urls || [],
      paid: paid || false,
      payment_id,
      amount,
    })

    return NextResponse.json(generation, { status: 201 })
  } catch (error) {
    console.error('Error creating generation:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET /api/generations - 获取用户的所有生成记录
export async function GET(request: NextRequest) {
  try {
    // 验证用户身份
    const authResult = await auth()
    const userId = authResult.userId

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // 获取用户的生成记录
    const generations = await getUserGenerations(userId)

    return NextResponse.json(generations, { status: 200 })
  } catch (error) {
    console.error('Error fetching generations:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
