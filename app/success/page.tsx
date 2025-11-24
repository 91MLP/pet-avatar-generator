'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useState, useEffect, Suspense } from 'react'
import Image from 'next/image'
import { useLanguage } from '@/contexts/LanguageContext'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import ShareButtons from '@/components/ShareButtons'

function SuccessContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { t } = useLanguage()
  const sessionId = searchParams.get('session_id')

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [images, setImages] = useState<string[]>([])
  const [amount, setAmount] = useState(0)

  useEffect(() => {
    if (!sessionId) {
      setError('无效的支付会话')
      setLoading(false)
      return
    }

    const verifyPayment = async () => {
      try {
        const response = await fetch('/api/verify-payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ session_id: sessionId }),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || '验证支付失败')
        }

        if (data.success && data.paid) {
          setImages(data.images)
          setAmount(data.amount)
        } else {
          throw new Error('支付未完成')
        }
      } catch (err) {
        console.error('验证错误:', err)
        setError(err instanceof Error ? err.message : '验证支付失败')
      } finally {
        setLoading(false)
      }
    }

    verifyPayment()
  }, [sessionId])

  const handleDownload = async (imageUrl: string, index: number) => {
    try {
      // 下载图片
      const response = await fetch(imageUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)

      // 创建下载链接
      const a = document.createElement('a')
      a.href = url
      a.download = `pet-avatar-${index + 1}.png`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    } catch (err) {
      console.error('下载失败:', err)
      alert('下载失败，请右键点击图片另存为')
    }
  }

  const handleDownloadAll = async () => {
    for (let i = 0; i < images.length; i++) {
      await handleDownload(images[i], i)
      // 添加延迟避免浏览器阻止多个下载
      await new Promise(resolve => setTimeout(resolve, 500))
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center">
        <LanguageSwitcher />
        <div className="bg-white rounded-2xl shadow-xl p-16 text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-purple-200 border-t-purple-600 mb-4"></div>
          <p className="text-xl font-semibold text-gray-700">{t('success.verifying')}</p>
          <p className="text-gray-500 mt-2">{t('success.wait')}</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center">
        <LanguageSwitcher />
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md">
          <div className="text-center">
            <div className="text-5xl mb-4">{t('success.error')}</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">{t('success.errorTitle')}</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => router.push('/')}
              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-all"
            >
              {t('success.backHome')}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <LanguageSwitcher />
      <main className="container mx-auto px-4 py-16 max-w-4xl">
        {/* 成功提示 */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">{t('success.title')}</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{t('success.successTitle')}</h1>
          <p className="text-lg text-gray-600">
            {t('success.thanks')}{amount.toFixed(2)}
          </p>
        </div>

        {/* 调试信息（已注释） */}
        {/* <div className="bg-yellow-100 border border-yellow-400 rounded-lg p-4 mb-6">
          <p className="text-sm font-mono">
            <strong>调试信息：</strong><br/>
            图片数量: {images.length}<br/>
            第一张 URL: {images[0]?.substring(0, 50)}...
          </p>
        </div> */}

        {/* 高清图片展示 */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold text-gray-900">
              {t('success.images')}
            </h2>
            <button
              onClick={handleDownloadAll}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all text-sm font-semibold"
            >
              {t('success.downloadAll')}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            {images.map((img, index) => (
              <div key={index}>
                <div className="relative aspect-square rounded-lg overflow-hidden border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
                  {img && (
                    <>
                      {/* 高清原图：无水印、无模糊 */}
                      <Image
                        src={img}
                        alt={`${t('success.alt.hd')}${index + 1}`}
                        fill
                        className="object-cover"
                        unoptimized
                        quality={100}
                      />
                      {/* 高清标识 */}
                      <div className="absolute top-2 right-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs px-2 py-1 rounded shadow-lg font-semibold">
                        ✨ 1024×1024 HD
                      </div>
                    </>
                  )}
                </div>
                {/* 下载按钮 */}
                <button
                  onClick={() => handleDownload(img, index)}
                  className="w-full mt-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-all text-sm font-semibold"
                >
                  {t('success.download')}{index + 1}
                </button>
              </div>
            ))}
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <p className="text-sm text-purple-900" dangerouslySetInnerHTML={{ __html: t('success.tip') }} />
          </div>
        </div>

        {/* 分享按钮 */}
        <ShareButtons />

        {/* 操作按钮 */}
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => router.push('/')}
            className="bg-white text-purple-600 border-2 border-purple-600 px-8 py-3 rounded-lg hover:bg-purple-50 transition-all font-semibold"
          >
            {t('success.home')}
          </button>
          <button
            onClick={() => router.push('/')}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all font-semibold"
          >
            {t('success.more')}
          </button>
        </div>
      </main>
    </div>
  )
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl p-16 text-center">
        <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-purple-200 border-t-purple-600 mb-4"></div>
        <p className="text-xl font-semibold text-gray-700">Loading...</p>
      </div>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <SuccessContent />
    </Suspense>
  )
}
