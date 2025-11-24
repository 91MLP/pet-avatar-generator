'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

type Language = 'zh' | 'en'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

// 翻译字典
const translations = {
  zh: {
    // 首页
    'home.title': '🐾 宠物 Q 版头像生成器',
    'home.subtitle': '输入你的宠物品种，生成超可爱的 Q 版头像',
    'home.tip': '💡 目前支持狗狗和猫咪品种，效果最佳',
    'home.breedLabel': '宠物品种',
    'home.breedPlaceholder': '例如：金毛、柯基、柴犬、布偶猫...',
    'home.breedTip': '常见品种：',
    'home.styleLabel': '选择 Q 版风格',
    'home.style.cute': '软萌大头',
    'home.style.cute.desc': '圆润可爱，大眼睛大头',
    'home.style.chibi': 'Q 版贴纸',
    'home.style.chibi.desc': '二头身，贴纸风格',
    'home.style.kawaii': '日系萌系',
    'home.style.kawaii.desc': '日式卡哇伊风格',
    'home.submit': '🎨 生成 Q 版头像',
    'home.pricing': '生成 4 张头像，2 张免费预览，高清原图仅需 $4.99',
    'home.alert.breed': '请输入宠物品种',

    // 生成页面
    'generate.title': '为你生成超可爱的 Q 版头像',
    'generate.generating': 'AI 正在生成中...',
    'generate.wait': '请稍候，大约需要几秒钟',
    'generate.preview': '✨ 免费预览（2 张）',
    'generate.free': '免费',
    'generate.locked': '🔒 高清原图（2 张）',
    'generate.unlock': '需解锁',
    'generate.locked.icon': '🔒',
    'generate.locked.text': '需要解锁',
    'generate.previewNote': '* 以上为低分辨率预览图，仅供参考',
    'generate.unlockTitle': '解锁全部 4 张高清原图',
    'generate.unlockDesc': '1024x1024 高分辨率 · 无水印 · 可商用 · 永久下载',
    'generate.price': '$4.99',
    'generate.oneTime': '一次性付费',
    'generate.unlockBtn': '💳 立即解锁',
    'generate.back': '← 返回首页，重新生成',

    // 支付页面
    'checkout.title': '正在跳转支付...',
    'checkout.wait': '请稍候',
    'checkout.error': '创建支付失败',
    'checkout.back': '返回重试',

    // 成功页面
    'success.verifying': '验证支付中...',
    'success.wait': '请稍候',
    'success.error': '⚠️',
    'success.errorTitle': '验证失败',
    'success.backHome': '返回首页',
    'success.title': '🎉',
    'success.successTitle': '支付成功！',
    'success.thanks': '感谢您的购买！已支付 $',
    'success.images': '✨ 您的高清原图（4 张）',
    'success.downloadAll': '📥 下载全部',
    'success.download': '下载图 ',
    'success.tip': '💡 <strong>提示：</strong>这些图片为 1024x1024 高分辨率，无水印，可用于商业用途。您可以随时重新访问此页面下载（请保存此页面链接）。',
    'success.home': '🏠 返回首页',
    'success.more': '✨ 生成更多头像',
    'success.alt.hd': '高清图 ',
    'success.alt.preview': '预览图 ',
    'success.alt.locked': '锁定图 ',

    // 品种名称
    'breed.shibaInu': '柴犬',
    'breed.goldenRetriever': '金毛',
    'breed.husky': '哈士奇',
    'breed.corgi': '柯基',
    'breed.poodle': '泰迪',
    'breed.borderCollie': '边牧',
    'breed.samoyed': '萨摩耶',
    'breed.labrador': '拉布拉多',
    'breed.ragdoll': '布偶猫',
    'breed.britishShorthair': '英短',
    'breed.americanShorthair': '美短',
    'breed.siamese': '暹罗猫',
    'breed.persian': '波斯猫',
    'breed.maineCoon': '缅因猫',
    'breed.orangeTabby': '橘猫',

    // 通用
    'common.loading': '加载中...',
  },
  en: {
    // Homepage
    'home.title': '🐾 Pet Q-version Avatar Generator',
    'home.subtitle': 'Enter your pet breed to generate super cute Q-version avatars',
    'home.tip': '💡 Currently supports dog and cat breeds for best results',
    'home.breedLabel': 'Pet Breed',
    'home.breedPlaceholder': 'e.g., Golden Retriever, Corgi, Shiba Inu, Ragdoll Cat...',
    'home.breedTip': 'Popular breeds:',
    'home.styleLabel': 'Choose Q-version Style',
    'home.style.cute': 'Soft & Cute',
    'home.style.cute.desc': 'Round and adorable, big eyes and head',
    'home.style.chibi': 'Chibi Sticker',
    'home.style.chibi.desc': '2-head-tall, sticker style',
    'home.style.kawaii': 'Kawaii Style',
    'home.style.kawaii.desc': 'Japanese kawaii style',
    'home.submit': '🎨 Generate Avatar',
    'home.pricing': 'Generate 4 images, 2 free previews, HD originals only $4.99',
    'home.alert.breed': 'Please enter pet breed',

    // Generate page
    'generate.title': 'Generating super cute Q-version avatars for you',
    'generate.generating': 'AI is generating...',
    'generate.wait': 'Please wait, it will take a few seconds',
    'generate.preview': '✨ Free Preview (2 images)',
    'generate.free': 'Free',
    'generate.locked': '🔒 HD Originals (2 images)',
    'generate.unlock': 'Locked',
    'generate.locked.icon': '🔒',
    'generate.locked.text': 'Need Unlock',
    'generate.previewNote': '* Low-resolution preview images for reference only',
    'generate.unlockTitle': 'Unlock All 4 HD Original Images',
    'generate.unlockDesc': '1024x1024 High Resolution · No Watermark · Commercial Use · Permanent Download',
    'generate.price': '$4.99',
    'generate.oneTime': 'One-time payment',
    'generate.unlockBtn': '💳 Unlock Now',
    'generate.back': '← Back to home, regenerate',

    // Checkout page
    'checkout.title': 'Redirecting to payment...',
    'checkout.wait': 'Please wait',
    'checkout.error': 'Failed to create payment',
    'checkout.back': 'Back to retry',

    // Success page
    'success.verifying': 'Verifying payment...',
    'success.wait': 'Please wait',
    'success.error': '⚠️',
    'success.errorTitle': 'Verification Failed',
    'success.backHome': 'Back to Home',
    'success.title': '🎉',
    'success.successTitle': 'Payment Successful!',
    'success.thanks': 'Thank you for your purchase! Paid $',
    'success.images': '✨ Your HD Original Images (4 images)',
    'success.downloadAll': '📥 Download All',
    'success.download': 'Download ',
    'success.tip': '💡 <strong>Tip:</strong> These images are 1024x1024 high resolution, no watermark, available for commercial use. You can revisit this page anytime to download (please save this page link).',
    'success.home': '🏠 Back to Home',
    'success.more': '✨ Generate More Avatars',
    'success.alt.hd': 'HD Image ',
    'success.alt.preview': 'Preview ',
    'success.alt.locked': 'Locked ',

    // Breed names
    'breed.shibaInu': 'Shiba Inu',
    'breed.goldenRetriever': 'Golden Retriever',
    'breed.husky': 'Husky',
    'breed.corgi': 'Corgi',
    'breed.poodle': 'Poodle',
    'breed.borderCollie': 'Border Collie',
    'breed.samoyed': 'Samoyed',
    'breed.labrador': 'Labrador',
    'breed.ragdoll': 'Ragdoll',
    'breed.britishShorthair': 'British Shorthair',
    'breed.americanShorthair': 'American Shorthair',
    'breed.siamese': 'Siamese',
    'breed.persian': 'Persian',
    'breed.maineCoon': 'Maine Coon',
    'breed.orangeTabby': 'Orange Tabby',

    // Common
    'common.loading': 'Loading...',
  },
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('zh')

  // 从 localStorage 加载语言偏好
  useEffect(() => {
    const savedLang = localStorage.getItem('language') as Language
    if (savedLang && (savedLang === 'zh' || savedLang === 'en')) {
      setLanguageState(savedLang)
    }
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem('language', lang)
  }

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['zh']] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
