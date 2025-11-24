'use client'

import { useLanguage } from '@/contexts/LanguageContext'

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage()

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 flex overflow-hidden">
        <button
          onClick={() => setLanguage('zh')}
          className={`px-4 py-2 text-sm font-medium transition-all ${
            language === 'zh'
              ? 'bg-purple-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          中文
        </button>
        <button
          onClick={() => setLanguage('en')}
          className={`px-4 py-2 text-sm font-medium transition-all ${
            language === 'en'
              ? 'bg-purple-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          English
        </button>
      </div>
    </div>
  )
}
