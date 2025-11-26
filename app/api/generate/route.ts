import Replicate from 'replicate'
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { hasEnoughCredits, deductCredits, getCreditsForStyle, getUserCredits } from '@/lib/credits'
import { createGeneration } from '@/lib/supabase'
import { clerkClient } from '@clerk/nextjs/server'

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
})

export async function POST(request: NextRequest) {
  try {
    const { breed, style } = await request.json()

    if (!breed || !style) {
      return NextResponse.json(
        { error: '缺少必要参数' },
        { status: 400 }
      )
    }

    // 验证用户身份
    const authResult = await auth()
    const userId = authResult.userId

    if (!userId) {
      return NextResponse.json(
        { error: '请先登录才能生成图片', code: 'UNAUTHORIZED' },
        { status: 401 }
      )
    }

    // 获取该风格需要的积分
    const requiredCredits = getCreditsForStyle(style)

    // 检查用户是否有足够的积分
    const hasCredits = await hasEnoughCredits(userId, requiredCredits)
    if (!hasCredits) {
      const currentCredits = await getUserCredits(userId)
      return NextResponse.json(
        {
          error: `积分不足。生成 ${style} 风格需要 ${requiredCredits} 积分，你当前有 ${currentCredits} 积分`,
          code: 'INSUFFICIENT_CREDITS',
          required: requiredCredits,
          current: currentCredits
        },
        { status: 402 } // 402 Payment Required
      )
    }

    // 根据风格构建 prompt
    const stylePrompts: Record<string, string> = {
      cute: 'cute chibi style, oversized head, big sparkling eyes, tiny body, kawaii, adorable expression, soft pastel colors, rounded shapes, bright lighting',
      chibi: 'chibi anime style, 2 heads tall proportions, super deformed, sticker design, vibrant colors, simple shading, bright and cheerful',
      kawaii: 'kawaii Japanese style, pastel colors, cute facial features, blush marks, dreamy atmosphere, soft lighting',
    }

    const stylePrompt = stylePrompts[style] || stylePrompts.cute

    // 构建完整的 prompt（优化版本，强调品种特征）
    // 移除 "dog/cat" 以支持其他宠物，让 AI 自动识别品种类型
    const prompt = `A ${breed} pet animal, ${stylePrompt}, accurate breed characteristics, realistic breed features, breed-specific traits, distinctive markings and fur pattern, portrait view, centered composition, clean white background, high quality pet illustration, professional digital art, bright colors, well lit, vibrant, detailed and recognizable breed`

    // 添加 negative prompt 避免黑色图片
    const negativePrompt = 'dark, black, shadow, night, low quality, blurry, distorted, ugly, bad anatomy, watermark'

    console.log('Generating with prompt:', prompt)

    // 生成 4 张图片（使用不同的 seed）
    const images: string[] = []

    for (let i = 0; i < 4; i++) {
      let retries = 0
      const maxRetries = 2
      let success = false

      while (retries < maxRetries && !success) {
        try {
          const output = await replicate.run(
            'bytedance/sdxl-lightning-4step:5599ed30703defd1d160a25a63321b4dec97101d98b4674bcc56e41f62f35637',
            {
              input: {
                prompt: prompt,
                negative_prompt: negativePrompt,
                width: 1024,
                height: 1024,
                num_inference_steps: 4,
                seed: Math.floor(Math.random() * 1000000),
              },
            }
          )

          // output 是一个数组，取第一个结果
          if (Array.isArray(output) && output.length > 0 && output[0]) {
            const imageUrl = String(output[0])
            if (imageUrl && imageUrl !== '') {
              images.push(imageUrl)
              success = true
            }
          }
        } catch (error) {
          retries++
          console.log(`生成图片 ${i + 1} 失败，重试 ${retries}/${maxRetries}:`, error instanceof Error ? error.message : error)

          // 如果是 NSFW 错误且还有重试机会，继续重试
          if (retries < maxRetries) {
            continue
          }

          // 如果重试次数用完，跳过这张图片（不抛出错误，继续生成其他图片）
          console.log(`跳过图片 ${i + 1}`)
          break
        }
      }
    }

    if (images.length === 0) {
      return NextResponse.json(
        { error: '生成失败，请重试' },
        { status: 500 }
      )
    }

    // 生成成功，扣除积分
    const deductResult = await deductCredits(userId, requiredCredits, `generation_${Date.now()}`)

    if (!deductResult.success) {
      console.error('Failed to deduct credits after generation')
      // 即使扣除失败，仍返回图片（用户已经生成了）
    }

    // 保存生成记录到数据库
    try {
      // 获取用户邮箱
      let userEmail: string | undefined
      try {
        const client = await clerkClient()
        const user = await client.users.getUser(userId)
        userEmail = user.emailAddresses[0]?.emailAddress
      } catch (emailError) {
        console.log('Could not fetch user email:', emailError)
        // 继续执行,userEmail 为 undefined
      }

      // 创建生成记录
      const generation = await createGeneration({
        user_id: userId,
        user_email: userEmail,
        breed: breed,
        style: style,
        preview_urls: images,
        hd_urls: images, // 当前使用相同的图片，支付后可以替换为真正的高清图
        paid: true, // 由于已经扣除积分，标记为已支付
      })

      console.log('Generation record created:', generation.id)
    } catch (error) {
      console.error('Failed to save generation record:', error)
      // 不影响返回结果，只记录错误
    }

    // 返回生成的图片 URLs
    return NextResponse.json({
      success: true,
      images: images,
      breed: breed,
      style: style,
      creditsUsed: requiredCredits,
      remainingCredits: deductResult.remainingCredits,
    })

  } catch (error) {
    console.error('生成错误:', error)
    return NextResponse.json(
      { error: '生成失败: ' + (error instanceof Error ? error.message : '未知错误') },
      { status: 500 }
    )
  }
}
