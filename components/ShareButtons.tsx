'use client'

import { useLanguage } from '@/contexts/LanguageContext'

interface ShareButtonsProps {
  breed?: string
}

export default function ShareButtons({ breed }: ShareButtonsProps) {
  const { t, language } = useLanguage()

  const shareText = language === 'zh'
    ? `我用 AI 生成了超可爱的${breed || '宠物'}Q版头像！🐾✨`
    : `I created a super cute Q-version avatar of my ${breed || 'pet'} with AI! 🐾✨`

  const shareUrl = typeof window !== 'undefined' ? window.location.origin : ''

  // 降级复制方法（兼容老旧浏览器）
  const fallbackCopyTextToClipboard = (text: string) => {
    const textArea = document.createElement('textarea')
    textArea.value = text
    textArea.style.position = 'fixed'
    textArea.style.top = '0'
    textArea.style.left = '0'
    textArea.style.width = '2em'
    textArea.style.height = '2em'
    textArea.style.padding = '0'
    textArea.style.border = 'none'
    textArea.style.outline = 'none'
    textArea.style.boxShadow = 'none'
    textArea.style.background = 'transparent'

    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()

    try {
      const successful = document.execCommand('copy')
      if (successful) {
        alert(language === 'zh' ? '链接已复制到剪贴板！' : 'Link copied to clipboard!')
      } else {
        alert(language === 'zh' ? '复制失败，请手动复制' : 'Copy failed, please copy manually')
      }
    } catch (err) {
      console.error('降级复制方法也失败了:', err)
      alert(language === 'zh' ? '复制失败，请手动复制' : 'Copy failed, please copy manually')
    }

    document.body.removeChild(textArea)
  }

  const handleShare = (platform: 'twitter' | 'facebook' | 'copy') => {
    const encodedText = encodeURIComponent(shareText)
    const encodedUrl = encodeURIComponent(shareUrl)

    switch (platform) {
      case 'twitter':
        window.open(
          `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
          '_blank',
          'width=550,height=420'
        )
        break
      case 'facebook':
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`,
          '_blank',
          'width=550,height=420'
        )
        break
      case 'copy':
        // 使用 Clipboard API 或降级到传统方法
        const textToCopy = `${shareText} ${shareUrl}`

        if (navigator.clipboard && window.isSecureContext) {
          // 现代浏览器：使用 Clipboard API
          navigator.clipboard.writeText(textToCopy)
            .then(() => {
              alert(language === 'zh' ? '链接已复制到剪贴板！' : 'Link copied to clipboard!')
            })
            .catch((err) => {
              console.error('复制失败:', err)
              fallbackCopyTextToClipboard(textToCopy)
            })
        } else {
          // 降级方案：使用传统方法
          fallbackCopyTextToClipboard(textToCopy)
        }
        break
    }
  }

  return (
    <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-3 text-center">
        {language === 'zh' ? '✨ 分享你的作品' : '✨ Share Your Creation'}
      </h3>
      <p className="text-sm text-gray-600 mb-4 text-center">
        {language === 'zh'
          ? '让更多朋友看到你的可爱宠物头像！'
          : 'Let your friends see your cute pet avatar!'}
      </p>
      <div className="flex gap-3 justify-center flex-wrap">
        <button
          onClick={() => handleShare('twitter')}
          className="flex items-center gap-2 bg-[#1DA1F2] text-white px-4 py-2 rounded-lg hover:bg-[#1a8cd8] transition-all text-sm font-medium"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
          </svg>
          Twitter
        </button>
        <button
          onClick={() => handleShare('facebook')}
          className="flex items-center gap-2 bg-[#1877F2] text-white px-4 py-2 rounded-lg hover:bg-[#165ec9] transition-all text-sm font-medium"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
          Facebook
        </button>
        <button
          onClick={() => handleShare('copy')}
          className="flex items-center gap-2 bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-all text-sm font-medium"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          {language === 'zh' ? '复制链接' : 'Copy Link'}
        </button>
      </div>
    </div>
  )
}
