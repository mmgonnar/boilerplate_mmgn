import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 💡 BOILERPLATE NOTE: Configura la URL de producción en tu .env
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  // 💡 BOILERPLATE NOTE: Añade aquí las rutas estáticas públicas de tu app
  const routes = ['', '/login', '/register', '/about', '/contact'];
  const locales = ['es', 'en'];

  const sitemapEntries: MetadataRoute.Sitemap = [];

  routes.forEach((route) => {
    locales.forEach((locale) => {
      const isDefault = locale === 'es'; // Tu idioma principal por defecto
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
