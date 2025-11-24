import Stripe from 'stripe'
import { NextRequest, NextResponse } from 'next/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
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
    ].filter(Boolean)

    if (images.length !== 4) {
      return NextResponse.json(
        { error: '图片数据不完整' },
        { status: 400 }
      )
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
