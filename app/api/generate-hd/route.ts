import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { hasEnoughCredits, deductCredits, CREDITS_PER_HD_GENERATION } from '@/lib/credits'
import { updateGeneration } from '@/lib/supabase'

// POST /api/generate-hd - 使用积分生成高清图
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
    const { images, generation_id } = body

    // 验证参数
    if (!images || !Array.isArray(images) || images.length === 0) {
      return NextResponse.json(
        { error: '无效的图片数据' },
        { status: 400 }
      )
    }

    if (!generation_id) {
      return NextResponse.json(
        { error: '缺少 generation_id' },
        { status: 400 }
      )
    }

    // 检查用户是否有足够的积分
    const hasCredits = await hasEnoughCredits(userId, CREDITS_PER_HD_GENERATION)
    if (!hasCredits) {
      return NextResponse.json(
        {
          error: '积分不足',
          code: 'INSUFFICIENT_CREDITS',
          required: CREDITS_PER_HD_GENERATION
        },
        { status: 402 } // 402 Payment Required
      )
    }

    // 扣除积分
    const deductResult = await deductCredits(
      userId,
      CREDITS_PER_HD_GENERATION,
      generation_id
    )

    if (!deductResult.success) {
      return NextResponse.json(
        {
          error: '扣除积分失败',
          code: 'DEDUCTION_FAILED',
          remainingCredits: deductResult.remainingCredits
        },
        { status: 402 }
      )
    }

    // 更新数据库中的生成记录
    try {
      await updateGeneration(generation_id, {
        hd_urls: images,
        paid: true,
        payment_id: `credits_${Date.now()}`, // 标记为积分支付
        amount: 0, // 使用积分，金额为 0
      })
      console.log(`Updated generation ${generation_id} with credits`)
    } catch (dbError) {
      console.error('Failed to update database:', dbError)
      // 数据库更新失败但积分已扣除，记录错误但仍返回成功
      // 用户已经付费（积分），所以应该能访问图片
    }

    // 返回成功结果
    return NextResponse.json({
      success: true,
      paid: true,
      images: images,
      creditsUsed: CREDITS_PER_HD_GENERATION,
      remainingCredits: deductResult.remainingCredits,
    })

  } catch (error) {
    console.error('Error generating HD images:', error)
    return NextResponse.json(
      { error: 'Failed to generate HD images' },
      { status: 500 }
    )
  }
}
