import { MetadataRoute } from 'next'

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://pet-avatar-generator.vercel.app'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/checkout', '/success'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
