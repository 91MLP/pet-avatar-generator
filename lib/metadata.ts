import { Metadata } from 'next'

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://pet-avatar-generator.vercel.app'

export const defaultMetadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'AI宠物Q版头像生成器 - 免费试用 | Pet Avatar Generator',
    template: '%s | Pet Avatar Generator',
  },
  description: '🎨 专业AI宠物Q版头像生成器，支持狗狗、猫咪等宠物品种。新用户免费获得3个积分！1024x1024超高清无水印，可商用。Generate super cute Q-version pet avatars with AI. Free trial for new users! High quality 1024x1024 HD images.',
  keywords: [
    'AI宠物头像',
    'Q版头像生成器',
    '宠物卡通头像',
    '免费宠物头像',
    'AI生成宠物',
    '狗狗头像',
    '猫咪头像',
    '宠物萌图',
    '宠物社交头像',
    'pet avatar generator',
    'AI pet avatar',
    'Q-version pet',
    'cute pet avatar',
    'dog avatar maker',
    'cat avatar creator',
    'chibi pet',
    'kawaii pet',
    'pet illustration',
    'free pet avatar',
    'HD pet image',
  ],
  authors: [{ name: 'Pet Avatar Generator' }],
  creator: 'Pet Avatar Generator',
  publisher: 'Pet Avatar Generator',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    alternateLocale: ['en_US'],
    url: baseUrl,
    title: 'AI宠物Q版头像生成器 - 新用户免费获得3个积分！',
    description: '🐾 专业AI驱动的宠物Q版头像生成器，支持狗狗、猫咪等多种宠物品种。新用户免费3积分，1024x1024超高清无水印图片，可商用。几秒钟即可生成超萌Q版头像！',
    siteName: 'Pet Avatar Generator',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'AI宠物Q版头像生成器 - 超可爱的宠物卡通头像',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI宠物Q版头像生成器 - 免费试用！',
    description: '🎨 用AI为你的宠物生成超萌Q版头像！新用户免费3积分，1024x1024高清无水印。支持狗狗、猫咪等多种品种，几秒钟即可生成！',
    images: ['/og-image.png'],
    creator: '@petavatar',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
}

export function generatePageMetadata({
  title,
  description,
  path,
  image,
}: {
  title: string
  description: string
  path: string
  image?: string
}): Metadata {
  const url = `${baseUrl}${path}`
  const ogImage = image || '/og-image.png'

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      title,
      description,
      images: [ogImage],
    },
  }
}
