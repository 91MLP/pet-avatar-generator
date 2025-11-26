'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useLanguage } from '@/contexts/LanguageContext'
import { Suspense, useEffect, useState } from 'react'
import NavBar from '@/components/NavBar'
import Link from 'next/link'

function SuccessContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { t } = useLanguage()
  const sessionId = searchParams.get('session_id')
  const [credits, setCredits] = useState<number | null>(null)

  // 获取最新积分余额
  const fetchCredits = async () => {
    try {
      const response = await fetch('/api/credits')
      if (response.ok) {
        const data = await response.json()
        setCredits(data.credits)
      }
    } catch (error) {
      console.error('Failed to fetch credits:', error)
    }
  }

  useEffect(() => {
    // 通知父页面刷新积分
    if (window.opener) {
      window.opener.postMessage({ type: 'CREDITS_UPDATED' }, '*')
    }

    // 延迟获取积分，给 webhook 时间处理
    const timer = setTimeout(() => {
      fetchCredits()
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center">
            {/* 成功图标 */}
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('credits.success.title') || '购买成功！'}
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              {t('credits.success.description') || '积分已添加到你的账户，现在可以开始生成高清宠物头像了！'}
            </p>

            {/* 成功信息 */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8">
              <p className="text-green-800">
                ✓ {t('credits.success.credited') || '积分已到账'}
              </p>
              {credits !== null && (
                <p className="text-lg font-semibold text-green-700 mt-2">
                  {t('credits.success.newBalance') || '当前余额'}: {credits} {t('credits.credits') || '积分'}
                </p>
              )}
              {sessionId && (
                <p className="text-sm text-green-600 mt-2">
                  {t('credits.success.orderId') || '订单号'}: {sessionId.slice(0, 20)}...
                </p>
              )}
            </div>

            {/* 操作按钮 */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/"
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg"
              >
                {t('credits.success.generate') || '开始生成头像'}
              </Link>
              <Link
                href="/history"
                className="px-8 py-3 bg-white text-purple-600 border-2 border-purple-600 font-semibold rounded-lg hover:bg-purple-50 transition-all"
              >
                {t('credits.success.viewHistory') || '查看历史记录'}
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      </main>
    </div>
  )
}

export default function CreditsSuccessPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <SuccessContent />
    </Suspense>
  )
}
