import { Toaster } from 'react-hot-toast';

import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { ThemeProvider } from 'next-themes';
import { headers } from 'next/headers';

import { AuthProvider } from '@/providers/auth-provider';

import '../globals.css';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  // 💡 BOILERPLATE NOTE: Cambia el namespace si tus textos base de SEO
  // (site_title, site_description) viven en un archivo o sección que no sea 'common'
  const t = await getTranslations({ locale, namespace: 'common' });

  // 💡 BOILERPLATE NOTE: Configura la URL base de tu nuevo proyecto en el archivo .env
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') ?? '/';

  // 💡 BOILERPLATE NOTE: Si tu nuevo proyecto soporta más idiomas o diferentes
  // (ej. ['es', 'en', 'fr']), actualiza este arreglo para que la limpieza del path funcione.
  const locales = ['es', 'en'];
  let pathWithoutLocale = pathname;

  for (const l of locales) {
    if (pathname === `/${l}`) {
      pathWithoutLocale = '/';
      break;
    }
    if (pathname.startsWith(`/${l}/`)) {
      pathWithoutLocale = pathname.slice(`/${l}`.length);
      break;
    }
  }

  const cleanPath = pathWithoutLocale === '/' ? '' : pathWithoutLocale;
  const canonical = pathname === '/' ? baseUrl : `${baseUrl}${pathname}`;

  return {
    title: {
      default: t('site_title'),
      template: `%s | ${t('site_title')}`,
    },
    description: t('site_description'),
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical,
      languages: {
        // 💡 BOILERPLATE NOTE: Mapea aquí las URLs alternas de indexación (hreflang).
        // Si tu next-intl NO usa prefijos para el idioma por defecto (ej. localePrefix: 'as-needed'),
        // ajusta las rutas para que coincidan exactamente con la estructura de tus URLs.
        en: `${baseUrl}/en${cleanPath}`,
        es: `${baseUrl}/es${cleanPath}`,
        'x-default': `${baseUrl}${cleanPath}`,
      },
    },
    openGraph: {
      type: 'website',
      // 💡 BOILERPLATE NOTE: Ajusta las regiones geográficas por defecto de tu target
      locale: locale === 'es' ? 'es_MX' : 'en_US',
      siteName: t('site_title'),
      title: t('site_title'),
      description: t('site_description'),
    },
    twitter: {
      card: 'summary_large_image',
      title: t('site_title'),
      description: t('site_description'),
    },
    robots: {
      // 💡 BOILERPLATE NOTE: Cambia a false si es un proyecto privado, dashboard interno
      // o staging que no quieres que Google indexe bajo ninguna circunstancia.
      index: true,
      follow: true,
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages({ locale });

  return (
    <html lang={locale} suppressHydrationWarning>
      <body>
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider
            attribute="class"
            // 💡 BOILERPLATE NOTE: Cambia el tema por defecto si tu nuevo proyecto
            // debe arrancar obligatoriamente en 'dark' o 'light' en lugar de heredar el del sistema.
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <AuthProvider>{children}</AuthProvider>
            <Toaster position="top-right" />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
