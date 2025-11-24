'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import { useUser } from '@clerk/nextjs'

export default function HeroSection() {
  const { t } = useLanguage()
  const { isSignedIn, user } = useUser()

  const scrollToForm = () => {
    const formElement = document.getElementById('generator-form')
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      {/* 渐变背景 */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 -z-10" />

      {/* 装饰圆圈 */}
      <div className="absolute top-20 right-10 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
      <div className="absolute top-40 left-10 w-64 h-64 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
      <div className="absolute -bottom-8 left-1/2 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        {/* 登录用户欢迎信息 */}
        {isSignedIn && (
          <div className="mb-6 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg border border-purple-100">
              <span className="text-2xl">👋</span>
              <span className="text-gray-700 font-medium">
                {t('hero.welcomeBack')}, <span className="text-purple-600 font-bold">{user?.firstName || user?.emailAddresses[0].emailAddress.split('@')[0]}</span>!
              </span>
            </div>
          </div>
        )}

        {/* 主标题 */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
          <span className="block">{t('hero.title.line1')}</span>
          <span className="block bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            {t('hero.title.line2')}
          </span>
        </h1>

        {/* 副标题 */}
        <p className="text-lg sm:text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
          {t('hero.subtitle')}
        </p>

        {/* 标签 */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          <span className="px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full text-sm font-medium text-gray-700 shadow-sm border border-gray-200">
            ✨ {t('hero.tag.ai')}
          </span>
          <span className="px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full text-sm font-medium text-gray-700 shadow-sm border border-gray-200">
            ⚡ {t('hero.tag.fast')}
          </span>
          <span className="px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full text-sm font-medium text-gray-700 shadow-sm border border-gray-200">
            💎 {t('hero.tag.hd')}
          </span>
        </div>

        {/* CTA 按钮 */}
        <button
          onClick={scrollToForm}
          className="inline-flex items-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-full hover:from-purple-700 hover:to-pink-700 transition-all shadow-xl hover:shadow-2xl hover:scale-105 transform duration-200"
        >
          {t('hero.cta')}
          <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* 价格提示 */}
        <p className="mt-6 text-sm text-gray-500">
          {t('hero.pricing')}
        </p>
      </div>
    </section>
  )
}
