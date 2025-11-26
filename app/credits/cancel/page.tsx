'use client'

import { useRouter } from 'next/navigation'
import { useLanguage } from '@/contexts/LanguageContext'
import NavBar from '@/components/NavBar'
import Link from 'next/link'

export default function CreditsCancelPage() {
  const router = useRouter()
  const { t } = useLanguage()

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center">
            {/* 取消图标 */}
            <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('credits.cancel.title') || '购买已取消'}
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              {t('credits.cancel.description') || '你已取消积分购买，没有产生任何费用。'}
            </p>

            {/* 提示信息 */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
              <p className="text-blue-800">
                💡 {t('credits.cancel.hint') || '如有疑问，可以随时回来购买积分'}
              </p>
            </div>

            {/* 操作按钮 */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/credits"
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg"
              >
                {t('credits.cancel.retry') || '重新购买'}
              </Link>
              <Link
                href="/"
                className="px-8 py-3 bg-white text-purple-600 border-2 border-purple-600 font-semibold rounded-lg hover:bg-purple-50 transition-all"
              >
                {t('credits.cancel.home') || '返回首页'}
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
