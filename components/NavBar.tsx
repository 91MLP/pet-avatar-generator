'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import { SignInButton, SignedIn, SignedOut, UserButton, useUser } from '@clerk/nextjs'
import Link from 'next/link'

export default function NavBar() {
  const { t, language, setLanguage } = useLanguage()
  const { user } = useUser()

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

          {/* 右侧：语言切换 + 用户信息 + 认证 */}
          <div className="flex items-center gap-3 sm:gap-4">
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
    </nav>
  )
}
