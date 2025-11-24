'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLanguage } from '@/contexts/LanguageContext'
import LanguageSwitcher from '@/components/LanguageSwitcher'

export default function Home() {
  const router = useRouter()
  const { t } = useLanguage()
  const [breed, setBreed] = useState('')
  const [style, setStyle] = useState('cute')

  // 品种列表（翻译键 → 英文值）
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
    { id: 'cute', name: t('home.style.cute'), description: t('home.style.cute.desc') },
    { id: 'chibi', name: t('home.style.chibi'), description: t('home.style.chibi.desc') },
    { id: 'kawaii', name: t('home.style.kawaii'), description: t('home.style.kawaii.desc') },
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!breed.trim()) {
      alert(t('home.alert.breed'))
      return
    }
    // 跳转到生成页面，传递品种和风格参数
    router.push(`/generate?breed=${encodeURIComponent(breed)}&style=${style}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <LanguageSwitcher />
      <main className="container mx-auto px-4 py-16 max-w-2xl">
        {/* 标题区域 */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            {t('home.title')}
          </h1>
          <p className="text-lg text-gray-600">
            {t('home.subtitle')}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            {t('home.tip')}
          </p>
        </div>

        {/* 表单区域 */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8">
          {/* 品种输入 */}
          <div className="mb-8">
            <label htmlFor="breed" className="block text-sm font-semibold text-gray-700 mb-2">
              {t('home.breedLabel')}
            </label>
            <input
              id="breed"
              type="text"
              value={breed}
              onChange={(e) => setBreed(e.target.value)}
              placeholder={t('home.breedPlaceholder')}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none text-gray-900 placeholder-gray-400"
            />

            {/* 常见品种快捷标签 */}
            <div className="mt-3">
              <p className="text-xs text-gray-500 mb-2">{t('home.breedTip')}</p>
              <div className="flex flex-wrap gap-2">
                {/* 狗狗品种 */}
                {dogBreeds.map((dog) => (
                  <button
                    key={dog.key}
                    type="button"
                    onClick={() => setBreed(dog.value)}
                    className="px-3 py-1 text-sm bg-purple-50 text-purple-700 rounded-full hover:bg-purple-100 transition-all border border-purple-200"
                  >
                    🐕 {t(dog.key)}
                  </button>
                ))}
                {/* 猫咪品种 */}
                {catBreeds.map((cat) => (
                  <button
                    key={cat.key}
                    type="button"
                    onClick={() => setBreed(cat.value)}
                    className="px-3 py-1 text-sm bg-pink-50 text-pink-700 rounded-full hover:bg-pink-100 transition-all border border-pink-200"
                  >
                    🐱 {t(cat.key)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 风格选择 */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              {t('home.styleLabel')}
            </label>
            <div className="grid grid-cols-1 gap-3">
              {styles.map((s) => (
                <label
                  key={s.id}
                  className={`relative flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    style === s.id
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-purple-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="style"
                    value={s.id}
                    checked={style === s.id}
                    onChange={(e) => setStyle(e.target.value)}
                    className="mt-1 mr-3 text-purple-600 focus:ring-purple-500"
                  />
                  <div>
                    <div className="font-semibold text-gray-900">{s.name}</div>
                    <div className="text-sm text-gray-500">{s.description}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* 提交按钮 */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 px-6 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl"
          >
            {t('home.submit')}
          </button>
        </form>

        {/* 提示信息 */}
        <div className="mt-8 text-center text-sm text-gray-500">
          {t('home.pricing')}
        </div>
      </main>
    </div>
  )
}
