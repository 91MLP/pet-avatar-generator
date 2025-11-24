'use client'

import { useLanguage } from '@/contexts/LanguageContext'

export default function PricingComparison() {
  const { t } = useLanguage()

  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* 标题 */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            {t('pricing.title')}
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            {t('pricing.subtitle')}
          </p>
        </div>

        {/* 对比卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto">
          {/* 免费预览 */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-gray-200">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                <span className="text-3xl">👀</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {t('pricing.free.title')}
              </h3>
              <div className="text-3xl font-bold text-gray-600">
                FREE
              </div>
            </div>

            <ul className="space-y-4">
              <li className="flex items-start">
                <svg className="w-6 h-6 text-gray-400 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700">{t('pricing.free.resolution')}</span>
              </li>
              <li className="flex items-start">
                <svg className="w-6 h-6 text-gray-400 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700">{t('pricing.free.count')}</span>
              </li>
              <li className="flex items-start">
                <svg className="w-6 h-6 text-gray-400 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700">{t('pricing.free.quality')}</span>
              </li>
              <li className="flex items-start">
                <svg className="w-6 h-6 text-gray-400 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span className="text-gray-500 line-through">{t('pricing.free.use')}</span>
              </li>
            </ul>
          </div>

          {/* 高清原图 */}
          <div className="relative bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl p-8 shadow-2xl border-2 border-purple-400 transform md:scale-105">
            {/* 推荐标签 */}
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="inline-block px-6 py-2 bg-yellow-400 text-yellow-900 font-bold text-sm rounded-full shadow-lg">
                ⭐ {t('generate.unlock')}
              </span>
            </div>

            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full mb-4">
                <span className="text-3xl">💎</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                {t('pricing.hd.title')}
              </h3>
              <div className="text-4xl font-bold text-white">
                {t('pricing.hd.price')}
              </div>
              <p className="text-white/80 text-sm mt-1">{t('generate.oneTime')}</p>
            </div>

            <ul className="space-y-4">
              <li className="flex items-start">
                <svg className="w-6 h-6 text-white mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-white font-medium">{t('pricing.hd.resolution')}</span>
              </li>
              <li className="flex items-start">
                <svg className="w-6 h-6 text-white mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-white font-medium">{t('pricing.hd.count')}</span>
              </li>
              <li className="flex items-start">
                <svg className="w-6 h-6 text-white mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-white font-medium">{t('pricing.hd.quality')}</span>
              </li>
              <li className="flex items-start">
                <svg className="w-6 h-6 text-white mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-white font-medium">{t('pricing.hd.use')}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* 底部说明 */}
        <div className="text-center mt-12 max-w-3xl mx-auto">
          <p className="text-gray-600 text-sm md:text-base leading-relaxed">
            {t('generate.comparison.desc')}
          </p>
        </div>
      </div>
    </section>
  )
}
