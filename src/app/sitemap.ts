// app/sitemap.ts

import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL!

  // You can dynamically fetch your pages/posts here if needed
  const staticPages = [
    '',        // homepage
    '/about',
    '/contact-us',
    '/faq',
    '/features',
    '/pricing',
    '/privacy',
    '/terms',
    
  ]

  return staticPages.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date().toISOString(),
  }))
}
