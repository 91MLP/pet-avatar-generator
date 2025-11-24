import Stripe from 'stripe'
import { NextRequest, NextResponse } from 'next/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-11-17.clover',
})

export async function POST(request: NextRequest) {
  try {
    const { images } = await request.json()

    if (!images || !Array.isArray(images) || images.length !== 4) {
      return NextResponse.json(
        { error: '无效的图片数据' },
        { status: 400 }
      )
    }

    // 创建 Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: '宠物 Q 版头像高清原图',
              description: '4 张 1024x1024 高清原图，无水印，可商用',
            },
            unit_amount: 499, // $4.99 (单位：美分)
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${request.headers.get('origin')}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.headers.get('origin')}/generate`,
      metadata: {
        // 将图片 URLs 存储在 metadata 中
        image_0: images[0],
        image_1: images[1],
        image_2: images[2],
        image_3: images[3],
      },
    })

    return NextResponse.json({ sessionId: session.id, url: session.url })
  } catch (error) {
    console.error('创建支付会话失败:', error)
    return NextResponse.json(
      { error: '创建支付会话失败: ' + (error instanceof Error ? error.message : '未知错误') },
      { status: 500 }
    )
  }
}
