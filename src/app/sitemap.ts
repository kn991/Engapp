import type { MetadataRoute } from 'next'
import { APP } from '@/config/app'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  return [
    { url: APP.url, lastModified: now, changeFrequency: 'monthly', priority: 1 },
    { url: `${APP.url}/privacy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${APP.url}/terms`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
  ]
}
