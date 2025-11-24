'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()
  const [breed, setBreed] = useState('')
  const [style, setStyle] = useState('cute')

  // 品种映射表（中文显示 → 英文名称）
  const breedMap: Record<string, string> = {
    // 狗狗
    '柴犬': 'Shiba Inu',
    '金毛': 'Golden Retriever',
    '哈士奇': 'Siberian Husky',
    '柯基': 'Welsh Corgi',
    '泰迪': 'Poodle',
    '边牧': 'Border Collie',
    '萨摩耶': 'Samoyed',
    '拉布拉多': 'Labrador Retriever',
    // 猫咪
    '布偶猫': 'Ragdoll Cat',
    '英短': 'British Shorthair',
    '美短': 'American Shorthair',
    '暹罗猫': 'Siamese Cat',
    '波斯猫': 'Persian Cat',
    '缅因猫': 'Maine Coon',
    '橘猫': 'Orange Tabby Cat',
  }

  const styles = [
    { id: 'cute', name: '软萌大头', description: '圆润可爱，大眼睛大头' },
    { id: 'chibi', name: 'Q 版贴纸', description: '二头身，贴纸风格' },
    { id: 'kawaii', name: '日系萌系', description: '日式卡哇伊风格' },
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!breed.trim()) {
      alert('请输入宠物品种')
      return
    }
    // 跳转到生成页面，传递品种和风格参数
    router.push(`/generate?breed=${encodeURIComponent(breed)}&style=${style}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <main className="container mx-auto px-4 py-16 max-w-2xl">
        {/* 标题区域 */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            🐾 宠物 Q 版头像生成器
          </h1>
          <p className="text-lg text-gray-600">
            输入你的宠物品种，生成超可爱的 Q 版头像
          </p>
          <p className="text-sm text-gray-500 mt-2">
            💡 目前支持狗狗和猫咪品种，效果最佳
          </p>
        </div>

        {/* 表单区域 */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8">
          {/* 品种输入 */}
          <div className="mb-8">
            <label htmlFor="breed" className="block text-sm font-semibold text-gray-700 mb-2">
              宠物品种
            </label>
            <input
              id="breed"
              type="text"
              value={breed}
              onChange={(e) => setBreed(e.target.value)}
              placeholder="例如：金毛、柯基、柴犬、布偶猫..."
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none text-gray-900 placeholder-gray-400"
            />

            {/* 常见品种快捷标签 */}
            <div className="mt-3">
              <p className="text-xs text-gray-500 mb-2">常见品种：</p>
              <div className="flex flex-wrap gap-2">
                {/* 狗狗品种 */}
                {['柴犬', '金毛', '哈士奇', '柯基', '泰迪', '边牧', '萨摩耶', '拉布拉多'].map((dog) => (
                  <button
                    key={dog}
                    type="button"
                    onClick={() => setBreed(breedMap[dog])}
                    className="px-3 py-1 text-sm bg-purple-50 text-purple-700 rounded-full hover:bg-purple-100 transition-all border border-purple-200"
                  >
                    🐕 {dog}
                  </button>
                ))}
                {/* 猫咪品种 */}
                {['布偶猫', '英短', '美短', '暹罗猫', '波斯猫', '缅因猫', '橘猫'].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setBreed(breedMap[cat])}
                    className="px-3 py-1 text-sm bg-pink-50 text-pink-700 rounded-full hover:bg-pink-100 transition-all border border-pink-200"
                  >
                    🐱 {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 风格选择 */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              选择 Q 版风格
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
            🎨 生成 Q 版头像
          </button>
        </form>

        {/* 提示信息 */}
        <div className="mt-8 text-center text-sm text-gray-500">
          生成 4 张头像，2 张免费预览，高清原图仅需 $4.99
        </div>
      </main>
    </div>
  )
}
