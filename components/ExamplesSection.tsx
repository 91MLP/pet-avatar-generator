'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import Image from 'next/image'

export default function ExamplesSection() {
  const { t } = useLanguage()

  // 示例作品数据
  // 说明：这里使用 Unsplash 的宠物图片作为临时占位符
  // 你可以替换为自己 AI 生成的图片，保存到 public/examples/ 目录
  const examples = [
    {
      id: 1,
      breed: t('breed.shibaInu'),
      // 临时使用 Unsplash 图片，你可以替换为 /examples/shiba-1.png
      imageUrl: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=500&h=500&fit=crop',
      alt: 'Shiba Inu Q-version avatar',
    },
    {
      id: 2,
      breed: t('breed.ragdoll'),
      imageUrl: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=500&h=500&fit=crop',
      alt: 'Ragdoll Cat Q-version avatar',
    },
    {
      id: 3,
      breed: t('breed.corgi'),
      imageUrl: 'https://images.unsplash.com/photo-1546527868-ccb7ee7dfa6a?w=500&h=500&fit=crop',
      alt: 'Corgi Q-version avatar',
    },
    {
      id: 4,
      breed: t('breed.britishShorthair'),
      imageUrl: 'https://images.unsplash.com/photo-1494256997604-768d1f608cac?w=500&h=500&fit=crop',
      alt: 'British Shorthair Q-version avatar',
    },
    {
      id: 5,
      breed: t('breed.husky'),
      imageUrl: 'https://images.unsplash.com/photo-1568393691622-c7ba131d63b4?w=500&h=500&fit=crop',
      alt: 'Husky Q-version avatar',
    },
    {
      id: 6,
      breed: t('breed.orangeTabby'),
      imageUrl: 'https://images.unsplash.com/photo-1615789591457-74a63395c990?w=500&h=500&fit=crop',
      alt: 'Orange Tabby Q-version avatar',
    },
  ]

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* 标题 */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            {t('examples.title')}
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            {t('examples.subtitle')}
          </p>
        </div>

        {/* 示例网格 */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 lg:gap-8 max-w-5xl mx-auto">
          {examples.map((example) => (
            <div
              key={example.id}
              className="group relative aspect-square rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer bg-gray-100"
            >
              {/* 图片 */}
              <Image
                src={example.imageUrl}
                alt={example.alt}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-300"
                sizes="(max-width: 768px) 50vw, 33vw"
              />

              {/* 悬停遮罩 */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                <div className="w-full p-4">
                  <p className="text-white font-semibold text-sm md:text-base mb-1">
                    {example.breed}
                  </p>
                  <p className="text-white/80 text-xs md:text-sm">
                    Q 版头像示例
                  </p>
                </div>
              </div>

              {/* 装饰边框 */}
              <div className="absolute inset-0 border-2 border-white/10 rounded-2xl pointer-events-none" />
            </div>
          ))}
        </div>

        {/* 底部提示 */}
        <div className="text-center mt-12">
          <p className="text-gray-500 text-sm md:text-base mb-4">
            {t('home.tip')}
          </p>
          <p className="text-gray-400 text-xs">
            💡 提示：以上为真实宠物照片示例，点击生成按钮即可获得专属 Q 版头像
          </p>
        </div>
      </div>
    </section>
  )
}
