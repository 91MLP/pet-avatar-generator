import { Metadata } from 'next'

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://pet-avatar-generator.vercel.app'

export const defaultMetadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'Pet Q-version Avatar Generator | AI宠物头像生成器',
    template: '%s | Pet Avatar Generator',
  },
  description: 'Generate super cute Q-version pet avatars with AI. Support dogs and cats. High quality 1024x1024 images. 用AI生成超可爱的宠物Q版头像，支持狗狗和猫咪，高清1024x1024无水印。',
  keywords: [
    'pet avatar',
    'Q-version',
    'AI image generator',
    'cute pet',
    'dog avatar',
    'cat avatar',
    '宠物头像',
    'Q版头像',
    'AI生成',
    '宠物卡通',
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
    title: 'Pet Q-version Avatar Generator | AI宠物头像生成器',
    description: 'Generate super cute Q-version pet avatars with AI. 用AI生成超可爱的宠物Q版头像',
    siteName: 'Pet Avatar Generator',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Pet Avatar Generator - Cute Q-version pet avatars',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pet Q-version Avatar Generator | AI宠物头像生成器',
    description: 'Generate super cute Q-version pet avatars with AI. 用AI生成超可爱的宠物Q版头像',
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
