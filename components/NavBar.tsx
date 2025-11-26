'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import { SignInButton, SignedIn, SignedOut, UserButton, useUser } from '@clerk/nextjs'
import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function NavBar() {
  const { t, language, setLanguage } = useLanguage()
  const { user } = useUser()
  const [credits, setCredits] = useState<number | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // 获取用户积分余额
  useEffect(() => {
    const fetchCredits = async () => {
      if (!user) return

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

    fetchCredits()

    // 监听页面可见性变化，从其他标签页返回时刷新积分
    const handleVisibilityChange = () => {
      if (!document.hidden && user) {
        fetchCredits()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [user])

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo + 品牌名 */}
          <div className="flex items-center space-x-3">
            <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
              <div className="text-3xl">🐾</div>
              <div className="flex flex-col">
                <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {language === 'zh' ? '宠物头像生成器' : 'Pet Avatar AI'}
                </span>
                <span className="text-xs text-gray-500 hidden sm:block">
                  {language === 'zh' ? 'AI 驱动的 Q 版头像' : 'AI-Powered Q-version Avatars'}
                </span>
              </div>
            </Link>
          </div>

          {/* 中间：导航链接（仅登录用户可见）*/}
          <SignedIn>
            <div className="hidden md:flex items-center gap-6">
              {/* 积分余额 */}
              <Link
                href="/credits"
                className="flex items-center gap-2 bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 border border-purple-200 rounded-lg px-3 py-2 transition-all"
              >
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-bold text-purple-600">
                    {credits !== null ? credits : '...'}
                  </span>
                  <span className="text-xs text-gray-600">
                    {t('nav.credits') || '积分'}
                  </span>
                </div>
              </Link>

              {/* 历史记录 */}
              <Link
                href="/history"
                className="text-gray-700 hover:text-purple-600 font-medium transition-colors flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {t('nav.history')}
              </Link>
            </div>
          </SignedIn>

          {/* 右侧：语言切换 + 用户信息 + 认证 + 移动菜单按钮 */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* 移动端菜单按钮（仅登录用户可见）*/}
            <SignedIn>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-gray-700 hover:text-purple-600 transition-colors"
                aria-label="Toggle mobile menu"
              >
                {mobileMenuOpen ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </SignedIn>

            {/* 语言切换器 */}
            <div className="bg-gray-100 rounded-lg flex overflow-hidden">
              <button
                onClick={() => setLanguage('zh')}
                className={`px-3 py-1.5 text-xs sm:text-sm font-medium transition-all ${
                  language === 'zh'
                    ? 'bg-purple-600 text-white'
                    : 'bg-transparent text-gray-700 hover:bg-gray-200'
                }`}
              >
                中文
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`px-3 py-1.5 text-xs sm:text-sm font-medium transition-all ${
                  language === 'en'
                    ? 'bg-purple-600 text-white'
                    : 'bg-transparent text-gray-700 hover:bg-gray-200'
                }`}
              >
                EN
              </button>
            </div>

            {/* 用户认证按钮 */}
            <SignedOut>
              <SignInButton mode="modal">
                <button className="px-4 py-2 text-sm sm:text-base bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-md hover:shadow-lg font-medium">
                  {t('auth.signIn')}
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              {/* 用户信息（桌面端显示）*/}
              <div className="hidden sm:flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.firstName || user?.emailAddresses[0].emailAddress.split('@')[0]}
                  </p>
                  <p className="text-xs text-gray-500">
                    {t('nav.welcome')}
                  </p>
                </div>
                <UserButton />
              </div>
              {/* 移动端仅显示头像 */}
              <div className="sm:hidden">
                <UserButton />
              </div>
            </SignedIn>
          </div>
        </div>
      </div>

      {/* 移动端菜单下拉（仅登录用户可见）*/}
      <SignedIn>
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
            <div className="container mx-auto px-4 py-4 space-y-3">
              {/* 积分余额 */}
              <Link
                href="/credits"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg"
              >
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm font-medium text-gray-700">
                    {t('nav.credits') || '积分'}
                  </span>
                </div>
                <span className="text-xl font-bold text-purple-600">
                  {credits !== null ? credits : '...'}
                </span>
              </Link>

              {/* 历史记录 */}
              <Link
                href="/history"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium">{t('nav.history')}</span>
              </Link>
            </div>
          </div>
        )}
      </SignedIn>
    </nav>
  )
}
