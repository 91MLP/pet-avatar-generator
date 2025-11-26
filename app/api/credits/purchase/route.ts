import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import Stripe from 'stripe'
import { CREDIT_PACKAGES } from '@/lib/credits'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-11-17.clover',
})

// POST /api/credits/purchase - 创建 Stripe 支付会话
export async function POST(request: NextRequest) {
  try {
    // 验证用户身份
    const authResult = await auth()
    const userId = authResult.userId

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 解析请求体
    const body = await request.json()
    const { credits } = body

    // 验证积分包是否有效
    const selectedPackage = CREDIT_PACKAGES.find(pkg => pkg.credits === credits)
    if (!selectedPackage) {
      return NextResponse.json(
        { error: 'Invalid credit package' },
        { status: 400 }
      )
    }

    // 获取应用 URL（开发环境使用 localhost）
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    // 创建 Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${selectedPackage.credits} 积分`,
              description: `购买 ${selectedPackage.credits} 个宠物头像生成积分`,
            },
            unit_amount: selectedPackage.price, // 价格（美分）
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${appUrl}/credits/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/credits/cancel`,
      metadata: {
        userId,
        credits: selectedPackage.credits.toString(),
        type: 'credit_purchase',
      },
    })

    return NextResponse.json({ sessionId: session.id, url: session.url })
  } catch (error) {
    console.error('Error creating checkout session:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
