'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useState, useEffect, Suspense } from 'react'
import Image from 'next/image'
import { useLanguage } from '@/contexts/LanguageContext'
import { useUser } from '@clerk/nextjs'
import LanguageSwitcher from '@/components/LanguageSwitcher'

function GenerateContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { t } = useLanguage()
  const { user } = useUser()
  const breed = searchParams.get('breed') || '未知品种'
  const style = searchParams.get('style') || 'cute'

  const [isGenerating, setIsGenerating] = useState(true)
  const [images, setImages] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)
  const [generationId, setGenerationId] = useState<string | null>(null)

  // 临时开关：true = Mock 数据，false = 真实 API
  const USE_MOCK_DATA = false

  // 保存生成记录到数据库
  const saveToDatabase = async (imageUrls: string[]) => {
    if (!user) {
      console.log('No user logged in, skipping database save')
      return null
    }

    try {
      const response = await fetch('/api/generations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          breed,
          style,
          preview_urls: imageUrls,
          user_email: user.emailAddresses[0].emailAddress,
          paid: false,
        }),
      })

      if (response.ok) {
        const generation = await response.json()
        console.log('Generation saved to database:', generation.id)
        return generation.id
      } else {
        console.error('Failed to save generation to database')
        return null
      }
    } catch (error) {
      console.error('Error saving to database:', error)
      return null
    }
  }

  // 生成图片
  useEffect(() => {
    // 如果没有品种参数，返回首页
    if (!searchParams.get('breed')) {
      router.push('/')
      return
    }

    const generateImages = async () => {
      try {
        setIsGenerating(true)
        setError(null)
        setProgress(0)

        if (USE_MOCK_DATA) {
          // Mock 模式：模拟进度
          for (let i = 0; i <= 100; i += 25) {
            setProgress(i)
            await new Promise(resolve => setTimeout(resolve, 500))
          }
          const mockImages = [
            'https://placehold.co/1024x1024/a78bfa/white?text=Pet+Avatar+1',
            'https://placehold.co/1024x1024/ec4899/white?text=Pet+Avatar+2',
            'https://placehold.co/1024x1024/8b5cf6/white?text=Pet+Avatar+3',
            'https://placehold.co/1024x1024/f472b6/white?text=Pet+Avatar+4',
          ]
          setImages(mockImages)
          setProgress(100)
        } else {
          // 真实 API 模式
          setProgress(25) // 开始请求

          const response = await fetch('/api/generate', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              breed: breed,
              style: style,
            }),
          })

          setProgress(75) // 接收响应

          const data = await response.json()

          if (!response.ok) {
            throw new Error(data.error || '生成失败')
          }

          if (data.success && data.images) {
            setImages(data.images)
            setProgress(100)

            // 保存到数据库
            const genId = await saveToDatabase(data.images)
            if (genId) {
              setGenerationId(genId)
              sessionStorage.setItem('generation_id', genId)
            }
          } else {
            throw new Error('生成失败，请重试')
          }
        }
      } catch (err) {
        console.error('生成错误:', err)
        setError(err instanceof Error ? err.message : '生成失败，请重试')
      } finally {
        setIsGenerating(false)
      }
    }

    generateImages()
  }, [searchParams, router, breed, style, user])

  const handleRetry = () => {
    setIsGenerating(true)
    setError(null)
    setProgress(0)
    window.location.reload()
  }

  const handleGenerateMore = () => {
    router.push('/')
  }

  const handleUnlock = () => {
    // 将图片数据存储到 sessionStorage
    sessionStorage.setItem('checkout_images', JSON.stringify(images))
    // 跳转到支付页面
    router.push('/checkout')
  }

  const styleNames: Record<string, string> = {
    cute: t('home.style.cute'),
    chibi: t('home.style.chibi'),
    kawaii: t('home.style.kawaii'),
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <LanguageSwitcher />
      <main className="container mx-auto px-4 py-16 max-w-4xl">
        {/* 标题 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {breed} · {styleNames[style]}
          </h1>
          <p className="text-gray-600">{t('generate.title')}</p>
        </div>

        {/* 生成中状态 */}
        {isGenerating && !error && (
          <div className="bg-white rounded-2xl shadow-xl p-16 text-center">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-purple-200 border-t-purple-600 mb-4"></div>
            <p className="text-xl font-semibold text-gray-700">{t('generate.generating')}</p>
            <p className="text-gray-500 mt-2">{t('generate.wait')}</p>

            {/* 进度条 */}
            <div className="mt-6 max-w-md mx-auto">
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-purple-600 to-pink-600 h-3 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-500 mt-2">{progress}%</p>
            </div>
          </div>
        )}

        {/* 错误状态 */}
        {error && !isGenerating && (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center max-w-2xl mx-auto">
            <div className="text-6xl mb-4">😢</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              {t('generate.error.title') || '生成失败'}
            </h2>
            <p className="text-gray-600 mb-6">{error}</p>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-yellow-900">
                💡 {t('generate.error.tips') || '可能的原因：网络问题、AI 服务暂时不可用、或者品种输入不正确'}
              </p>
            </div>

            <div className="flex gap-4 justify-center">
              <button
                onClick={handleRetry}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all font-semibold shadow-lg"
              >
                🔄 {t('generate.error.retry') || '重试'}
              </button>
              <button
                onClick={handleGenerateMore}
                className="bg-white text-purple-600 border-2 border-purple-600 px-8 py-3 rounded-lg hover:bg-purple-50 transition-all font-semibold"
              >
                ← {t('generate.error.back') || '返回首页'}
              </button>
            </div>
          </div>
        )}

        {/* 生成结果 */}
        {!isGenerating && images.length > 0 && (
          <div className="space-y-8">
            {/* 免费预览区域 */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  {t('generate.preview')}
                </h2>
                <span className="text-sm text-green-600 font-semibold bg-green-50 px-3 py-1 rounded-full">
                  {t('generate.free')}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {images.slice(0, 2).map((img, index) => (
                  <div key={index} className="relative aspect-square rounded-lg overflow-hidden border-2 border-gray-300 bg-gray-100">
                    {img && (
                      <>
                        {/* 降质预览图：缩小 60% + 中度模糊 */}
                        <div className="absolute inset-0 flex items-center justify-center p-8">
                          <div className="relative w-full h-full scale-75">
                            <Image
                              src={img}
                              alt={`${t('success.alt.preview')}${index + 1}`}
                              fill
                              className="object-contain blur-sm"
                              unoptimized
                              quality={50}
                              style={{ imageRendering: 'pixelated' }}
                            />
                          </div>
                        </div>
                        {/* 明显水印 */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="text-gray-400 text-opacity-60 text-5xl font-bold transform -rotate-12 select-none">
                            PREVIEW
                          </div>
                        </div>
                        {/* 质量降低提示 */}
                        <div className="absolute bottom-2 left-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded text-center">
                          {t('generate.lowQuality')}
                        </div>
                        {/* 分辨率标识 */}
                        <div className="absolute top-2 right-2 bg-yellow-600 text-white text-xs px-2 py-1 rounded font-semibold">
                          512×512
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-3">
                {t('generate.previewNote')}
              </p>
            </div>

            {/* 质量对比说明 */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border-2 border-blue-200">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl">
                    🔍
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {t('generate.comparison.title') || '免费预览 vs 高清原图对比'}
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {/* 免费预览 */}
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-green-600 font-semibold">
                          {t('generate.comparison.free') || '✓ 免费预览'}
                        </span>
                      </div>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>{t('generate.comparison.freeRes') || '• 分辨率：512x512'}</li>
                        <li>{t('generate.comparison.freeSuit') || '• 适合：在线预览'}</li>
                        <li>{t('generate.comparison.freeQuality') || '• 质量：中等'}</li>
                        <li>{t('generate.comparison.freeLimit') || '• 限制：仅 2 张'}</li>
                      </ul>
                    </div>

                    {/* 高清原图 */}
                    <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg p-4 text-white">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold">
                          {t('generate.comparison.hd') || '⭐ 高清原图 - $4.99'}
                        </span>
                      </div>
                      <ul className="text-sm space-y-1">
                        <li dangerouslySetInnerHTML={{ __html: t('generate.comparison.hdRes') || '• 分辨率：1024x1024 <strong>(4倍清晰)</strong>' }} />
                        <li>{t('generate.comparison.hdSuit') || '• 适合：打印、商用、头像'}</li>
                        <li>{t('generate.comparison.hdQuality') || '• 质量：超高清无损'}</li>
                        <li>{t('generate.comparison.hdCount') || '• 数量：全部 4 张'}</li>
                        <li>{t('generate.comparison.hdExtra') || '• 无水印 + 永久下载'}</li>
                      </ul>
                    </div>
                  </div>

                  <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <p className="text-sm text-yellow-900">
                      💡 <strong>{t('generate.comparison.tip') || '提示：'}</strong>
                      {t('generate.comparison.desc') || '高清原图分辨率是预览图的 4 倍，细节更丰富，适合打印、制作周边或商业使用'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 需要解锁区域 */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  {t('generate.locked')}
                </h2>
                <span className="text-sm text-purple-600 font-semibold bg-purple-50 px-3 py-1 rounded-full">
                  {t('generate.unlock')}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {images.slice(2, 4).map((img, index) => (
                  <div key={index} className="relative aspect-square rounded-lg overflow-hidden border-2 border-gray-200">
                    {img && (
                      <>
                        <Image
                          src={img}
                          alt={`${t('success.alt.locked')}${index + 3}`}
                          fill
                          className="object-cover blur-xl"
                          unoptimized
                        />
                        {/* 高清标识（模糊状态） */}
                        <div className="absolute top-2 right-2 bg-purple-600 text-white text-xs px-2 py-1 rounded blur-sm">
                          1024×1024
                        </div>
                      </>
                    )}
                    <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                      <div className="text-white text-center">
                        <div className="text-4xl mb-2">{t('generate.locked.icon')}</div>
                        <div className="text-sm font-semibold">{t('generate.locked.text')}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 解锁按钮 */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl shadow-xl p-8 text-white text-center">
              <h3 className="text-2xl font-bold mb-2">{t('generate.unlockTitle')}</h3>
              <p className="text-purple-100 mb-6">
                {t('generate.unlockDesc')}
              </p>
              <div className="flex items-center justify-center gap-2 mb-6">
                <span className="text-4xl font-bold">{t('generate.price')}</span>
                <span className="text-purple-200">{t('generate.oneTime')}</span>
              </div>
              <button
                onClick={handleUnlock}
                className="bg-white text-purple-600 font-bold py-4 px-12 rounded-lg hover:bg-purple-50 transition-all shadow-lg text-lg"
              >
                {t('generate.unlockBtn')}
              </button>
            </div>

            {/* 返回首页和生成更多 */}
            <div className="flex gap-4 justify-center">
              <button
                onClick={handleGenerateMore}
                className="bg-white text-purple-600 border-2 border-purple-600 px-8 py-3 rounded-lg hover:bg-purple-50 transition-all font-semibold"
              >
                ✨ {t('generate.generateMore') || '生成更多头像'}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <main className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="bg-white rounded-2xl shadow-xl p-16 text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-purple-200 border-t-purple-600 mb-4"></div>
          <p className="text-xl font-semibold text-gray-700">Loading...</p>
        </div>
      </main>
    </div>
  )
}

export default function GeneratePage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <GenerateContent />
    </Suspense>
  )
}
