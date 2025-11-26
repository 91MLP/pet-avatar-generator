'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useLanguage } from '@/contexts/LanguageContext'
import { useUser, SignInButton } from '@clerk/nextjs'
import Link from 'next/link'

export default function GeneratorForm() {
  const router = useRouter()
  const { t } = useLanguage()
  const { user, isLoaded } = useUser()
  const [breed, setBreed] = useState('')
  const [style, setStyle] = useState('cute')
  const [credits, setCredits] = useState<number | null>(null)

  // 获取用户积分
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

    if (isLoaded && user) {
      fetchCredits()
    }
  }, [user, isLoaded])

  // 品种列表
  const dogBreeds = [
    { key: 'breed.shibaInu', value: 'Shiba Inu' },
    { key: 'breed.goldenRetriever', value: 'Golden Retriever' },
    { key: 'breed.husky', value: 'Siberian Husky' },
    { key: 'breed.corgi', value: 'Welsh Corgi' },
    { key: 'breed.poodle', value: 'Poodle' },
    { key: 'breed.borderCollie', value: 'Border Collie' },
    { key: 'breed.samoyed', value: 'Samoyed' },
    { key: 'breed.labrador', value: 'Labrador Retriever' },
  ]

  const catBreeds = [
    { key: 'breed.ragdoll', value: 'Ragdoll Cat' },
    { key: 'breed.britishShorthair', value: 'British Shorthair' },
    { key: 'breed.americanShorthair', value: 'American Shorthair' },
    { key: 'breed.siamese', value: 'Siamese Cat' },
    { key: 'breed.persian', value: 'Persian Cat' },
    { key: 'breed.maineCoon', value: 'Maine Coon' },
    { key: 'breed.orangeTabby', value: 'Orange Tabby Cat' },
  ]

  const styles = [
    { id: 'cute', name: t('home.style.cute'), description: t('home.style.cute.desc'), credits: 1 },
    { id: 'chibi', name: t('home.style.chibi'), description: t('home.style.chibi.desc'), credits: 2 },
    { id: 'kawaii', name: t('home.style.kawaii'), description: t('home.style.kawaii.desc'), credits: 3 },
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!breed.trim()) {
      alert(t('home.alert.breed'))
      return
    }
    router.push(`/generate?breed=${encodeURIComponent(breed)}&style=${style}`)
  }

  return (
    <section id="generator-form" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {/* 区域标题 */}
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('home.title')}
            </h2>
            <p className="text-gray-600">
              {t('home.subtitle')}
            </p>
          </div>

          {/* 表单卡片 */}
          <form onSubmit={handleSubmit} className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 md:p-8 lg:p-10 border border-purple-100">
            {/* 品种输入 */}
            <div className="mb-8">
              <label htmlFor="breed" className="block text-base sm:text-lg font-semibold text-gray-800 mb-3">
                {t('home.breedLabel')}
              </label>
              <input
                id="breed"
                type="text"
                value={breed}
                onChange={(e) => setBreed(e.target.value)}
                placeholder={t('home.breedPlaceholder')}
                className="w-full px-5 py-4 border-2 border-purple-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none text-gray-900 placeholder-gray-400 bg-white shadow-sm text-base sm:text-lg transition-all"
              />

              {/* 快捷标签 */}
              <div className="mt-4">
                <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3">{t('home.breedTip')}</p>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {dogBreeds.map((dog) => (
                    <button
                      key={dog.key}
                      type="button"
                      onClick={() => setBreed(dog.value)}
                      className="px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm bg-white text-purple-700 rounded-full hover:bg-purple-100 transition-all border border-purple-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 whitespace-nowrap"
                    >
                      🐕 {t(dog.key)}
                    </button>
                  ))}
                  {catBreeds.map((cat) => (
                    <button
                      key={cat.key}
                      type="button"
                      onClick={() => setBreed(cat.value)}
                      className="px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm bg-white text-pink-700 rounded-full hover:bg-pink-100 transition-all border border-pink-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 whitespace-nowrap"
                    >
                      🐱 {t(cat.key)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 风格选择 */}
            <div className="mb-8">
              <label className="block text-base sm:text-lg font-semibold text-gray-800 mb-4">
                {t('home.styleLabel')}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {styles.map((s) => (
                  <label
                    key={s.id}
                    className={`relative flex flex-col p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      style === s.id
                        ? 'border-purple-500 bg-purple-100 shadow-lg'
                        : 'border-gray-200 bg-white hover:border-purple-300 hover:shadow-md'
                    }`}
                  >
                    <input
                      type="radio"
                      name="style"
                      value={s.id}
                      checked={style === s.id}
                      onChange={(e) => setStyle(e.target.value)}
                      className="sr-only"
                    />
                    <div className="flex items-center justify-between mb-1">
                      <div className="font-semibold text-gray-900">{s.name}</div>
                      <div className="flex items-center gap-1 px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs font-bold">
                        <span>💎</span>
                        <span>{s.credits}</span>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">{s.description}</div>
                    {style === s.id && (
                      <div className="absolute top-2 right-2 w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </label>
                ))}
              </div>
            </div>

            {/* 提交按钮 */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-5 px-6 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5 text-base sm:text-lg"
            >
              {t('home.submit')}
            </button>

            {/* 底部提示 */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 mb-2">
                {t('home.creditInfo') || '生成将消耗相应积分，生成 4 张 1024x1024 高清图片'}
              </p>
              <p className="text-xs text-gray-500">
                {t('home.loginRequired') || '需要登录才能生成'}
              </p>
            </div>
          </form>

          {/* 积分状态提示卡片 */}
          {isLoaded && (
            <div className="mt-6 bg-white rounded-xl p-6 shadow-md border border-purple-100">
              {user ? (
                <div>
                  {/* 已登录用户 - 显示积分余额 */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                        <span className="text-2xl">💎</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{t('credits.currentBalance')}</h3>
                        <p className="text-sm text-gray-600">{t('credits.balanceDesc')}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold text-purple-600">
                        {credits !== null ? credits : '...'}
                      </p>
                      <p className="text-xs text-gray-600">{t('credits.credits')}</p>
                    </div>
                  </div>

                  {/* 积分不足警告 */}
                  {credits !== null && credits < 1 && (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
                      <div className="flex items-start gap-3">
                        <span className="text-xl">⚠️</span>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-amber-900 mb-1">
                            {t('generate.insufficientCredits') || '积分不足'}
                          </p>
                          <p className="text-xs text-amber-700">
                            {t('credits.balanceDesc') || '你需要至少 1 个积分来解锁高清图片'}
                          </p>
                        </div>
                        <Link
                          href="/credits"
                          className="px-4 py-2 bg-amber-600 text-white text-sm font-medium rounded-lg hover:bg-amber-700 transition-colors whitespace-nowrap"
                        >
                          {t('credits.buyNow') || '购买积分'}
                        </Link>
                      </div>
                    </div>
                  )}

                  {/* 积分使用说明 */}
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>💡 {t('credits.faq.a1')}</p>
                  </div>
                </div>
              ) : (
                /* 未登录用户 - 显示免费试用信息 */
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                    <span className="text-3xl">🎁</span>
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg mb-2">
                    {t('hero.freeTrial') || '新用户免费获得 3 个积分！'}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {t('credits.faq.a1') || '注册后即可获得 3 个免费积分，体验高清图片生成'}
                  </p>
                  <SignInButton mode="modal">
                    <button className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg">
                      {t('auth.signIn') || '立即登录领取'}
                    </button>
                  </SignInButton>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
