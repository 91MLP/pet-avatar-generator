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

  const steps = [
    {
      number: '1',
      title: t('howto.step1.title') || '注册并获得免费积分',
      description: t('howto.step1.desc') || '新用户注册即可获得 3 个免费积分，每个积分可解锁 4 张高清图片',
      icon: '🎁',
    },
    {
      number: '2',
      title: t('howto.step2.title') || '输入宠物品种并生成',
      description: t('howto.step2.desc') || '输入你的宠物品种，选择喜欢的风格，点击生成按钮',
      icon: '✨',
    },
    {
      number: '3',
      title: t('howto.step3.title') || '查看预览图',
      description: t('howto.step3.desc') || '立即获得 2 张免费预览图，查看效果是否满意',
      icon: '👀',
    },
    {
      number: '4',
      title: t('howto.step4.title') || '使用积分解锁高清图',
      description: t('howto.step4.desc') || '使用 1 个积分解锁全部 4 张 1024x1024 高清无水印图片',
      icon: '💎',
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 max-w-6xl mx-auto mb-20">
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

        {/* 使用步骤 */}
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('howto.title') || '🚀 如何使用'}
            </h2>
            <p className="text-lg text-gray-600">
              {t('howto.subtitle') || '4 步即可获得专属 Q 版宠物头像'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                {/* 连接线（桌面端） */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-purple-300 to-transparent -ml-3 z-0" />
                )}

                <div className="relative bg-white rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all border border-purple-100 h-full">
                  {/* 步骤图标和数字 */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                      {step.number}
                    </div>
                    <span className="text-3xl">{step.icon}</span>
                  </div>

                  {/* 标题 */}
                  <h3 className="font-bold text-gray-900 mb-2 text-lg">
                    {step.title}
                  </h3>

                  {/* 描述 */}
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* 底部提示 */}
          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full text-white font-semibold shadow-lg">
              <span className="text-xl">🎁</span>
              <span>{t('hero.freeTrial') || '新用户免费获得 3 个积分！立即体验 AI 生成'}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
