'use client'

import { useLanguage } from '@/contexts/LanguageContext'

export default function FeaturesSection() {
  const { t } = useLanguage()

  const features = [
    {
      icon: '🎨',
      title: t('features.ai.title'),
      description: t('features.ai.desc'),
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      icon: '⚡',
      title: t('features.fast.title'),
      description: t('features.fast.desc'),
      gradient: 'from-yellow-500 to-orange-500',
    },
    {
      icon: '💎',
      title: t('features.hd.title'),
      description: t('features.hd.desc'),
      gradient: 'from-blue-500 to-cyan-500',
    },
  ]

  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* 标题 */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            {t('features.title')}
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            {t('features.subtitle')}
          </p>
        </div>

        {/* 卖点卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
            >
              {/* 背景渐变 */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`} />

              {/* 图标 */}
              <div className={`relative w-16 h-16 mb-6 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-3xl shadow-lg`}>
                {feature.icon}
              </div>

              {/* 标题 */}
              <h3 className="relative text-xl md:text-2xl font-bold text-gray-900 mb-4">
                {feature.title}
              </h3>

              {/* 描述 */}
              <p className="relative text-gray-600 leading-relaxed">
                {feature.description}
              </p>

              {/* 装饰线 */}
              <div className={`absolute bottom-0 left-0 h-1 w-0 group-hover:w-full bg-gradient-to-r ${feature.gradient} transition-all duration-300 rounded-b-2xl`} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
