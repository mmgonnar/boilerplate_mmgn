import { MetadataRoute } from 'next';

import { routing } from '@/i18n/routing';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 💡 BOILERPLATE NOTE: Set the production URL in your .env file
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  // 💡 BOILERPLATE NOTE: Add your app's public static routes here
  const routes = ['', '/about', '/features', '/pricing'];

  const sitemapEntries: MetadataRoute.Sitemap = [];

  routes.forEach((route) => {
    routing.locales.forEach((locale) => {
      const isDefault = locale === routing.defaultLocale;
      const url = isDefault
        ? `${baseUrl}${route}`
        : `${baseUrl}/${locale}${route}`;

      sitemapEntries.push({
        url: url || baseUrl,
        lastModified: new Date(),
        changeFrequency: route === '' ? 'daily' : 'weekly',
        priority: route === '' ? 1.0 : 0.7,
      });
    });
  });

  return sitemapEntries;
}
