'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useLanguage } from '@/contexts/LanguageContext'
import LanguageSwitcher from '@/components/LanguageSwitcher'

function CheckoutContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { t } = useLanguage()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const createCheckout = async () => {
      try {
        // 从 sessionStorage 获取图片数据
        const imagesData = sessionStorage.getItem('checkout_images')
        if (!imagesData) {
          throw new Error('未找到图片数据，请重新生成')
        }

        const images = JSON.parse(imagesData)

        // 从 sessionStorage 获取 generation_id（用于链接数据库记录）
        const generationId = sessionStorage.getItem('generation_id')

        // 调用 API 创建 Stripe Checkout Session
        const response = await fetch('/api/create-checkout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ images, generation_id: generationId }),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || '创建支付会话失败')
        }

        // 重定向到 Stripe 支付页面
        if (data.url) {
          window.location.href = data.url
        } else {
          throw new Error('未获取到支付链接')
        }
      } catch (err) {
        console.error('支付错误:', err)
        setError(err instanceof Error ? err.message : '创建支付失败，请重试')
      }
    }

    createCheckout()
  }, [])

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center">
        <LanguageSwitcher />
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md">
          <div className="text-center">
            <div className="text-5xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">{t('checkout.error')}</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => router.back()}
              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-all"
            >
              {t('checkout.back')}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center">
      <LanguageSwitcher />
      <div className="bg-white rounded-2xl shadow-xl p-16 text-center">
        <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-purple-200 border-t-purple-600 mb-4"></div>
        <p className="text-xl font-semibold text-gray-700">{t('checkout.title')}</p>
        <p className="text-gray-500 mt-2">{t('checkout.wait')}</p>
      </div>
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

export default function CheckoutPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <CheckoutContent />
    </Suspense>
  )
}
