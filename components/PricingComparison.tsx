'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import Link from 'next/link'

export default function CreditSystemInfo() {
  const { t } = useLanguage()

  const styleCredits = [
    {
      style: t('home.style.cute') || '萌系风格',
      credits: 1,
      quality: t('creditsystem.standard') || '标准',
      description: t('creditsystem.cute.desc') || '圆润可爱，大眼睛大头',
      gradient: 'from-blue-500 to-cyan-500',
      features: [
        t('creditsystem.cute.feature1') || '快速生成，性价比高',
        t('creditsystem.cute.feature2') || '圆润可爱风格',
        t('creditsystem.cute.feature3') || '适合个人使用',
        t('creditsystem.cute.feature4') || '社交媒体分享',
      ]
    },
    {
      style: t('home.style.chibi') || '贴纸风格',
      credits: 2,
      quality: t('creditsystem.advanced') || '高级',
      description: t('creditsystem.chibi.desc') || '二头身，精致贴纸风格',
      gradient: 'from-purple-500 to-pink-500',
      features: [
        t('creditsystem.chibi.feature1') || '精致贴纸效果',
        t('creditsystem.chibi.feature2') || '细节优化处理',
        t('creditsystem.chibi.feature3') || '支持商业用途',
        t('creditsystem.chibi.feature4') || '适合品牌宣传',
      ]
    },
    {
      style: t('home.style.kawaii') || '日系风格',
      credits: 3,
      quality: t('creditsystem.professional') || '专业',
      description: t('creditsystem.kawaii.desc') || '日式卡哇伊，最高质量',
      gradient: 'from-orange-500 to-red-500',
      features: [
        t('creditsystem.kawaii.feature1') || '艺术级绘制质量',
        t('creditsystem.kawaii.feature2') || '专业商用授权',
        t('creditsystem.kawaii.feature3') || '日系美学巅峰',
        t('creditsystem.kawaii.feature4') || '适合高端设计',
      ]
    },
  ]

  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* 标题 */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            {t('creditsystem.title') || '积分系统说明'}
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            {t('creditsystem.subtitle') || '不同风格消耗不同积分，生成即高清'}
          </p>
        </div>

        {/* 风格积分卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto mb-12">
          {styleCredits.map((item, index) => (
            <div
              key={index}
              className="relative bg-white rounded-2xl p-6 sm:p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-gray-100 overflow-hidden"
            >
              {/* 背景渐变 */}
              <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-5`} />

              {/* 内容 */}
              <div className="relative">
                {/* 质量标签 */}
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-3 py-1 bg-gradient-to-r ${item.gradient} text-white text-xs font-bold rounded-full`}>
                    {item.quality}
                  </span>
                  <div className="flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full font-bold">
                    <span className="text-lg">💎</span>
                    <span>{item.credits}</span>
                  </div>
                </div>

                {/* 风格名称 */}
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {item.style}
                </h3>

                {/* 描述 */}
                <p className="text-gray-600 text-sm mb-4">
                  {item.description}
                </p>

                {/* 特性列表 */}
                <ul className="space-y-2 text-sm">
                  {item.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-gray-700">
                      <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* 所有套餐包含 */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-200">
            <h3 className="font-bold text-gray-900 text-lg mb-4 text-center">
              {t('creditsystem.allInclude.title') || '✨ 所有套餐均包含'}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-3xl mb-2">📸</div>
                <p className="text-sm font-semibold text-gray-900">{t('creditsystem.allInclude.images') || '4 张图片'}</p>
                <p className="text-xs text-gray-500">{t('creditsystem.allInclude.imagesDesc') || '每次生成'}</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">🎨</div>
                <p className="text-sm font-semibold text-gray-900">{t('creditsystem.allInclude.resolution') || '高清画质'}</p>
                <p className="text-xs text-gray-500">{t('creditsystem.allInclude.resolutionDesc') || '1024x1024'}</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">💧</div>
                <p className="text-sm font-semibold text-gray-900">{t('creditsystem.allInclude.watermark') || '无水印'}</p>
                <p className="text-xs text-gray-500">{t('creditsystem.allInclude.watermarkDesc') || '纯净图片'}</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">💾</div>
                <p className="text-sm font-semibold text-gray-900">{t('creditsystem.allInclude.download') || '永久下载'}</p>
                <p className="text-xs text-gray-500">{t('creditsystem.allInclude.downloadDesc') || '随时保存'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* 底部说明 */}
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg border border-purple-100">
            <div className="flex items-start gap-3 mb-4">
              <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-xl">🎁</span>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 text-lg mb-2">
                  {t('creditsystem.newuser.title') || '新用户福利'}
                </h3>
                <p className="text-gray-600 mb-3">
                  {t('creditsystem.newuser.desc') || '注册即可获得 3 个免费积分，体验 AI 生成的魅力！'}
                </p>
                <Link
                  href="/credits"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-md hover:shadow-lg text-sm"
                >
                  <span>💎</span>
                  <span>{t('creditsystem.buyCredits') || '购买更多积分'}</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
