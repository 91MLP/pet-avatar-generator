'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useState, useEffect, Suspense } from 'react'
import Image from 'next/image'
import { useLanguage } from '@/contexts/LanguageContext'
import LanguageSwitcher from '@/components/LanguageSwitcher'

function GenerateContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { t } = useLanguage()
  const breed = searchParams.get('breed') || '未知品种'
  const style = searchParams.get('style') || 'cute'

  const [isGenerating, setIsGenerating] = useState(true)
  const [images, setImages] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)

  // 临时开关：true = Mock 数据，false = 真实 API
  const USE_MOCK_DATA = false

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

        if (USE_MOCK_DATA) {
          // Mock 模式：模拟 2 秒生成时间
          await new Promise(resolve => setTimeout(resolve, 2000))
          const mockImages = [
            'https://placehold.co/1024x1024/a78bfa/white?text=Pet+Avatar+1',
            'https://placehold.co/1024x1024/ec4899/white?text=Pet+Avatar+2',
            'https://placehold.co/1024x1024/8b5cf6/white?text=Pet+Avatar+3',
            'https://placehold.co/1024x1024/f472b6/white?text=Pet+Avatar+4',
          ]
          setImages(mockImages)
        } else {
          // 真实 API 模式
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

          const data = await response.json()

          if (!response.ok) {
            throw new Error(data.error || '生成失败')
          }

          if (data.success && data.images) {
            setImages(data.images)
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
  }, [searchParams, router, breed, style])

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
        {isGenerating && (
          <div className="bg-white rounded-2xl shadow-xl p-16 text-center">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-purple-200 border-t-purple-600 mb-4"></div>
            <p className="text-xl font-semibold text-gray-700">{t('generate.generating')}</p>
            <p className="text-gray-500 mt-2">{t('generate.wait')}</p>
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
                  <div key={index} className="relative aspect-square rounded-lg overflow-hidden border-2 border-gray-200">
                    {img && (
                      <Image
                        src={img}
                        alt={`${t('success.alt.preview')}${index + 1}`}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    )}
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-3">
                {t('generate.previewNote')}
              </p>
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
                      <Image
                        src={img}
                        alt={`${t('success.alt.locked')}${index + 3}`}
                        fill
                        className="object-cover blur-xl"
                        unoptimized
                      />
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

            {/* 返回首页 */}
            <div className="text-center">
              <button
                onClick={() => router.push('/')}
                className="text-gray-600 hover:text-gray-900 underline"
              >
                {t('generate.back')}
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
