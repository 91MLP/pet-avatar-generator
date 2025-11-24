import Stripe from 'stripe'
import { NextRequest, NextResponse } from 'next/server'
import { updateGeneration } from '@/lib/supabase'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-11-17.clover',
})

export async function POST(request: NextRequest) {
  try {
    const { session_id } = await request.json()

    if (!session_id) {
      return NextResponse.json(
        { error: '缺少 session_id' },
        { status: 400 }
      )
    }

    // 从 Stripe 获取支付会话信息
    const session = await stripe.checkout.sessions.retrieve(session_id)

    // 验证支付状态
    if (session.payment_status !== 'paid') {
      return NextResponse.json(
        { error: '支付未完成' },
        { status: 400 }
      )
    }

    // 从 metadata 中获取图片 URLs
    const images = [
      session.metadata?.image_0,
      session.metadata?.image_1,
      session.metadata?.image_2,
      session.metadata?.image_3,
    ].filter((img): img is string => Boolean(img))

    if (images.length !== 4) {
      return NextResponse.json(
        { error: '图片数据不完整' },
        { status: 400 }
      )
    }

    // 从 metadata 中获取 generation_id
    const generationId = session.metadata?.generation_id

    // 如果存在 generation_id，更新数据库记录
    if (generationId) {
      try {
        await updateGeneration(generationId, {
          hd_urls: images,
          paid: true,
          payment_id: session_id,
          amount: session.amount_total ? session.amount_total / 100 : 0,
        })
        console.log(`Database updated for generation ${generationId}`)
      } catch (dbError) {
        console.error('Failed to update database:', dbError)
        // 不阻止支付验证成功，即使数据库更新失败
        // 用户仍然可以获取高清图片
      }
    } else {
      console.log('No generation_id found, skipping database update')
    }

    // 返回高清图片 URLs
    return NextResponse.json({
      success: true,
      paid: true,
      images: images,
      amount: session.amount_total ? session.amount_total / 100 : 0,
    })

  } catch (error) {
    console.error('验证支付失败:', error)
    return NextResponse.json(
      { error: '验证支付失败: ' + (error instanceof Error ? error.message : '未知错误') },
      { status: 500 }
    )
  }
}
