'use client'

import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useLanguage } from '@/contexts/LanguageContext'
import { useState, useEffect } from 'react'
import NavBar from '@/components/NavBar'
import { CREDIT_PACKAGES } from '@/lib/credits'
import { loadStripe } from '@stripe/stripe-js'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '')

export default function CreditsPage() {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const { t } = useLanguage()
  const [credits, setCredits] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [purchasing, setPurchasing] = useState<number | null>(null)

  useEffect(() => {
    if (isLoaded) {
      if (user) {
        fetchCredits()
      } else {
        setLoading(false)
      }
    }
  }, [isLoaded, user])

  // 监听来自成功页面的消息，刷新积分
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'CREDITS_UPDATED') {
        fetchCredits()
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [])

  // 从支付页面返回时刷新积分
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && user) {
        fetchCredits()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [user])

  const fetchCredits = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/credits?transactions=true')

      if (!response.ok) {
        throw new Error('Failed to fetch credits')
      }

      const data = await response.json()
      setCredits(data.credits)
    } catch (err) {
      console.error('Error fetching credits:', err)
    } finally {
      setLoading(false)
    }
  }

  const handlePurchase = async (packageCredits: number) => {
    if (!user) {
      alert(t('credits.loginRequired') || '请先登录')
      return
    }

    try {
      setPurchasing(packageCredits)

      // 创建 Stripe checkout session
      const response = await fetch('/api/credits/purchase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          credits: packageCredits,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session')
      }

      // 跳转到 Stripe Checkout
      if (data.url) {
        window.location.href = data.url
      }
    } catch (error) {
      console.error('Purchase error:', error)
      alert(t('credits.purchaseError') || '购买失败，请重试')
    } finally {
      setPurchasing(null)
    }
  }

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">{t('common.loading')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        {/* 页面标题 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {t('credits.title') || '购买积分'}
          </h1>
          <p className="text-lg text-gray-600">
            {t('credits.subtitle') || '使用积分生成高清宠物头像，无需每次付费'}
          </p>
        </div>

        {/* 未登录提示 */}
        {!user && (
          <div className="max-w-4xl mx-auto mb-12">
            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-8 text-center">
              <div className="text-5xl mb-4">🔒</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {t('credits.loginRequired') || '请先登录'}
              </h2>
              <p className="text-gray-600 mb-4">
                {t('credits.loginRequiredDesc') || '你需要登录后才能购买积分'}
              </p>
            </div>
          </div>
        )}

        {/* 当前积分余额 */}
        {user && (
          <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center text-white text-2xl">
                  💎
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {t('credits.currentBalance') || '当前余额'}
                  </h2>
                  <p className="text-gray-600">
                    {t('credits.balanceDesc') || '你可以使用积分生成高清图'}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-5xl font-bold text-purple-600">{credits !== null ? credits : '...'}</p>
                <p className="text-sm text-gray-600">{t('credits.credits') || '积分'}</p>
              </div>
            </div>
          </div>
        </div>
        )}

        {/* 积分套餐 */}
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            {t('credits.packages') || '选择套餐'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {CREDIT_PACKAGES.map((pkg, index) => (
              <div
                key={index}
                className={`bg-white rounded-2xl shadow-lg overflow-hidden transition-all hover:shadow-xl ${
                  pkg.popular ? 'ring-2 ring-purple-600 scale-105' : ''
                }`}
              >
                {pkg.popular && (
                  <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-center py-2 text-sm font-semibold">
                    {t('credits.popular') || '🔥 最受欢迎'}
                  </div>
                )}
                <div className="p-6">
                  <div className="text-center mb-6">
                    <div className="text-5xl font-bold text-gray-900 mb-2">{pkg.credits}</div>
                    <div className="text-gray-600">{t('credits.credits') || '积分'}</div>
                  </div>
                  <div className="text-center mb-6">
                    <div className="text-3xl font-bold text-purple-600">
                      ${(pkg.price / 100).toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      ${((pkg.price / 100) / pkg.credits).toFixed(2)} {t('credits.perCredit') || '/积分'}
                    </div>
                  </div>
                  <ul className="space-y-2 mb-6 text-sm text-gray-600">
                    <li className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {t('credits.feature1') || `可生成 ${pkg.credits} 次高清图`}
                    </li>
                    <li className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {t('credits.feature2') || '永不过期'}
                    </li>
                    <li className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {t('credits.feature3') || '1024x1024 高清'}
                    </li>
                  </ul>
                  <button
                    onClick={() => handlePurchase(pkg.credits)}
                    disabled={purchasing !== null}
                    className={`w-full py-3 rounded-lg font-semibold transition-all ${
                      pkg.popular
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    } ${purchasing === pkg.credits ? 'opacity-50 cursor-wait' : ''}`}
                  >
                    {purchasing === pkg.credits
                      ? (t('credits.purchasing') || '处理中...')
                      : (t('credits.buyNow') || '立即购买')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 常见问题 */}
        <div className="max-w-4xl mx-auto mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            {t('credits.faq.title') || '常见问题'}
          </h2>
          <div className="space-y-4">
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="font-semibold text-gray-900 mb-2">
                {t('credits.faq.q1') || '积分如何使用？'}
              </h3>
              <p className="text-gray-600">
                {t('credits.faq.a1') || '生成宠物头像预览图后，使用 1 个积分即可解锁全部 4 张 1024x1024 高清无水印图片。'}
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="font-semibold text-gray-900 mb-2">
                {t('credits.faq.q2') || '积分会过期吗？'}
              </h3>
              <p className="text-gray-600">
                {t('credits.faq.a2') || '不会！积分永不过期，随时可用。'}
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="font-semibold text-gray-900 mb-2">
                {t('credits.faq.q3') || '支持哪些支付方式？'}
              </h3>
              <p className="text-gray-600">
                {t('credits.faq.a3') || '我们使用 Stripe 支付，支持信用卡、借记卡等多种支付方式，安全可靠。'}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
