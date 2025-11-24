import Replicate from 'replicate'
import { NextRequest, NextResponse } from 'next/server'

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

    // 根据风格构建 prompt
    const stylePrompts: Record<string, string> = {
      cute: 'cute chibi style, big head, kawaii, adorable, soft colors',
      chibi: 'chibi anime style, 2 heads tall, sticker style, simple background',
      kawaii: 'kawaii Japanese style, pastel colors, cute expression, anime',
    }

    const stylePrompt = stylePrompts[style] || stylePrompts.cute

    // 构建完整的 prompt
    const prompt = `A ${breed} pet, ${stylePrompt}, high quality illustration, white background, centered composition, digital art`

    console.log('Generating with prompt:', prompt)

    // 生成 4 张图片（使用不同的 seed）
    const images: string[] = []

    for (let i = 0; i < 4; i++) {
      const output = await replicate.run(
        'bytedance/sdxl-lightning-4step:5599ed30703defd1d160a25a63321b4dec97101d98b4674bcc56e41f62f35637',
        {
          input: {
            prompt: prompt,
            width: 1024,
            height: 1024,
            num_inference_steps: 4,
            seed: Math.floor(Math.random() * 1000000),
          },
        }
      )

      // output 是一个数组，取第一个结果
      if (Array.isArray(output) && output.length > 0) {
        images.push(output[0] as string)
      }
    }

    if (images.length === 0) {
      return NextResponse.json(
        { error: '生成失败，请重试' },
        { status: 500 }
      )
    }

    // 返回生成的图片 URLs
    return NextResponse.json({
      success: true,
      images: images,
      breed: breed,
      style: style,
    })

  } catch (error) {
    console.error('生成错误:', error)
    return NextResponse.json(
      { error: '生成失败: ' + (error instanceof Error ? error.message : '未知错误') },
      { status: 500 }
    )
  }
}
