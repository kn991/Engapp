import type { MetadataRoute } from 'next'
import { APP } from '@/config/app'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/privacy', '/terms'],
      disallow: ['/home', '/train', '/words', '/progress', '/profile', '/onboarding', '/admin', '/auth'],
    },
    sitemap: `${APP.url}/sitemap.xml`,
  }
}
