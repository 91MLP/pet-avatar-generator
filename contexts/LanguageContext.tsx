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
    // Hero 区域
    'hero.title.line1': '用 AI 为你的宠物',
    'hero.title.line2': '生成超萌 Q 版头像',
    'hero.subtitle': '只需输入品种，几秒钟即可获得 4 张专属 Q 版头像，完美适配社交媒体、头像、周边制作',
    'hero.tag.ai': 'AI 智能生成',
    'hero.tag.fast': '秒级出图',
    'hero.tag.hd': '高清无水印',
    'hero.cta': '立即开始生成',
    'hero.pricing': '2 张免费预览 + 2 张高清原图仅需 $4.99',
    'hero.welcomeBack': '欢迎回来',

    // Features 卖点
    'features.title': '为什么选择我们',
    'features.subtitle': '专业 AI 技术，极致用户体验',
    'features.ai.title': '🎨 AI 智能生成',
    'features.ai.desc': '基于先进的 AI 模型，自动理解宠物特征，生成独一无二的 Q 版形象',
    'features.fast.title': '⚡ 秒级出图',
    'features.fast.desc': '无需等待，输入品种后几秒钟即可获得 4 张精美头像',
    'features.hd.title': '💎 高清无水印',
    'features.hd.desc': '1024x1024 超高清分辨率，无水印，支持商业使用，永久下载',

    // Examples 示例
    'examples.title': '精美示例作品',
    'examples.subtitle': '看看其他用户生成的可爱头像',

    // Pricing Comparison
    'pricing.title': '免费预览 vs 高清原图',
    'pricing.subtitle': '看看升级后能获得什么',
    'pricing.free.title': '免费预览',
    'pricing.free.resolution': '512x512 分辨率',
    'pricing.free.count': '2 张预览图',
    'pricing.free.quality': '中等质量',
    'pricing.free.use': '仅供预览',
    'pricing.hd.title': '高清原图',
    'pricing.hd.price': '$4.99',
    'pricing.hd.resolution': '1024x1024 (4倍清晰)',
    'pricing.hd.count': '全部 4 张',
    'pricing.hd.quality': '超高清无损',
    'pricing.hd.use': '可商用 + 永久下载',

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
    'generate.lowQuality': '低质量预览',
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
    'generate.generateMore': '生成更多头像',
    'generate.error.title': '生成失败',
    'generate.error.tips': '可能的原因：网络问题、AI 服务暂时不可用、或者品种输入不正确',
    'generate.error.retry': '重试',
    'generate.error.back': '返回首页',
    'generate.comparison.title': '免费预览 vs 高清原图对比',
    'generate.comparison.tip': '提示：',
    'generate.comparison.desc': '高清原图分辨率是预览图的 4 倍，细节更丰富，适合打印、制作周边或商业使用',
    'generate.comparison.free': '✓ 免费预览',
    'generate.comparison.freeRes': '• 分辨率：512x512',
    'generate.comparison.freeSuit': '• 适合：在线预览',
    'generate.comparison.freeQuality': '• 质量：中等',
    'generate.comparison.freeLimit': '• 限制：仅 2 张',
    'generate.comparison.hd': '⭐ 高清原图 - $4.99',
    'generate.comparison.hdRes': '• 分辨率：1024x1024 <strong>(4倍清晰)</strong>',
    'generate.comparison.hdSuit': '• 适合：打印、商用、头像',
    'generate.comparison.hdQuality': '• 质量：超高清无损',
    'generate.comparison.hdCount': '• 数量：全部 4 张',
    'generate.comparison.hdExtra': '• 无水印 + 永久下载',

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

    // 导航栏
    'nav.history': '历史记录',
    'nav.welcome': '欢迎使用',

    // 历史记录页面
    'history.title': '我的生成记录',
    'history.subtitle': '查看你之前生成的所有 Q 版头像',
    'history.totalGenerations': '总生成数',
    'history.paid': '已付费',
    'history.images': '张图片',
    'history.hdImages': '张高清图',
    'history.view': '查看',
    'history.download': '下载',
    'history.empty.title': '还没有生成记录',
    'history.empty.description': '开始生成你的第一个 Q 版宠物头像吧！',
    'history.empty.cta': '立即开始生成',

    // 认证
    'auth.signIn': '登录',
    'auth.signUp': '注册',

    // 通用
    'common.loading': '加载中...',
  },
  en: {
    // Hero Section
    'hero.title.line1': 'Generate Adorable',
    'hero.title.line2': 'Q-version Pet Avatars with AI',
    'hero.subtitle': 'Just enter the breed, get 4 exclusive Q-version avatars in seconds, perfect for social media, profiles, and merchandise',
    'hero.tag.ai': 'AI Powered',
    'hero.tag.fast': 'Instant Results',
    'hero.tag.hd': 'HD & No Watermark',
    'hero.cta': 'Start Generating Now',
    'hero.pricing': '2 Free Previews + 2 HD Originals for $4.99',
    'hero.welcomeBack': 'Welcome back',

    // Features
    'features.title': 'Why Choose Us',
    'features.subtitle': 'Professional AI technology, ultimate user experience',
    'features.ai.title': '🎨 AI Smart Generation',
    'features.ai.desc': 'Based on advanced AI models, automatically understands pet features to create unique Q-version images',
    'features.fast.title': '⚡ Instant Results',
    'features.fast.desc': 'No waiting required, get 4 beautiful avatars in seconds after entering breed',
    'features.hd.title': '💎 HD No Watermark',
    'features.hd.desc': '1024x1024 ultra-high resolution, no watermark, commercial use supported, permanent download',

    // Examples
    'examples.title': 'Beautiful Examples',
    'examples.subtitle': 'See cute avatars created by other users',

    // Pricing Comparison
    'pricing.title': 'Free Preview vs HD Original',
    'pricing.subtitle': 'See what you get with the upgrade',
    'pricing.free.title': 'Free Preview',
    'pricing.free.resolution': '512x512 Resolution',
    'pricing.free.count': '2 Preview Images',
    'pricing.free.quality': 'Medium Quality',
    'pricing.free.use': 'Preview Only',
    'pricing.hd.title': 'HD Original',
    'pricing.hd.price': '$4.99',
    'pricing.hd.resolution': '1024x1024 (4x Clearer)',
    'pricing.hd.count': 'All 4 Images',
    'pricing.hd.quality': 'Ultra HD Lossless',
    'pricing.hd.use': 'Commercial Use + Permanent Download',

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
    'generate.lowQuality': 'Low Quality Preview',
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
    'generate.generateMore': 'Generate More',
    'generate.error.title': 'Generation Failed',
    'generate.error.tips': 'Possible reasons: Network issues, AI service temporarily unavailable, or incorrect breed input',
    'generate.error.retry': 'Retry',
    'generate.error.back': 'Back to Home',
    'generate.comparison.title': 'Free Preview vs HD Original Comparison',
    'generate.comparison.tip': 'Tip:',
    'generate.comparison.desc': 'HD originals have 4x the resolution of previews, with richer details, suitable for printing, merchandise, or commercial use',
    'generate.comparison.free': '✓ Free Preview',
    'generate.comparison.freeRes': '• Resolution: 512x512',
    'generate.comparison.freeSuit': '• Best for: Online preview',
    'generate.comparison.freeQuality': '• Quality: Medium',
    'generate.comparison.freeLimit': '• Limit: Only 2 images',
    'generate.comparison.hd': '⭐ HD Original - $4.99',
    'generate.comparison.hdRes': '• Resolution: 1024x1024 <strong>(4x clearer)</strong>',
    'generate.comparison.hdSuit': '• Best for: Printing, commercial use, avatar',
    'generate.comparison.hdQuality': '• Quality: Ultra HD lossless',
    'generate.comparison.hdCount': '• Count: All 4 images',
    'generate.comparison.hdExtra': '• No watermark + Permanent download',

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

    // Navigation
    'nav.history': 'History',
    'nav.welcome': 'Welcome',

    // History Page
    'history.title': 'My Generation History',
    'history.subtitle': 'View all your previously generated Q-version avatars',
    'history.totalGenerations': 'Total Generations',
    'history.paid': 'Paid',
    'history.images': 'images',
    'history.hdImages': 'HD images',
    'history.view': 'View',
    'history.download': 'Download',
    'history.empty.title': 'No Generations Yet',
    'history.empty.description': 'Start generating your first Q-version pet avatar!',
    'history.empty.cta': 'Start Generating',

    // Authentication
    'auth.signIn': 'Sign In',
    'auth.signUp': 'Sign Up',

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
