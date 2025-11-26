import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { addCredits } from '@/lib/credits'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-11-17.clover',
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || ''

// POST /api/credits/webhook - Stripe webhook 处理器
export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('stripe-signature')

    if (!signature) {
      return NextResponse.json(
        { error: 'No signature provided' },
        { status: 400 }
      )
    }

    // 验证 webhook 签名
    let event: Stripe.Event
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      )
    }

    // 处理 checkout.session.completed 事件
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session

      // 检查是否是积分购买
      if (session.metadata?.type === 'credit_purchase') {
        const userId = session.metadata.userId
        const credits = parseInt(session.metadata.credits || '0', 10)
        const paymentIntentId = session.payment_intent as string

        if (!userId || credits <= 0) {
          console.error('Invalid metadata in session:', session.metadata)
          return NextResponse.json(
            { error: 'Invalid session metadata' },
            { status: 400 }
          )
        }

        // 添加积分到用户账户
        try {
          await addCredits(userId, credits, paymentIntentId, session.id)
          console.log(`Added ${credits} credits to user ${userId}`)
        } catch (error) {
          console.error('Error adding credits:', error)
          return NextResponse.json(
            { error: 'Failed to add credits' },
            { status: 500 }
          )
        }
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}
