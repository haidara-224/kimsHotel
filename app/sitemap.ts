import type { MetadataRoute } from 'next'
 
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://kimshotel.net',
      lastModified: new Date().toISOString(),
      changeFrequency: 'weekly',
      priority: 0.8,
      
    },
  ]
}