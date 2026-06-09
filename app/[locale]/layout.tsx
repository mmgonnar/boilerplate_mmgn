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

  // 💡 BOILERPLATE NOTE: Change this namespace if your SEO texts live in a file other than 'common'
  const t = await getTranslations({ locale, namespace: 'common' });

  // 💡 BOILERPLATE NOTE: Set the production URL in your .env file
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') ?? '/';

  // 💡 BOILERPLATE NOTE: Update this array if your project supports more locales (e.g. ['es', 'en', 'fr'])
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
        // 💡 BOILERPLATE NOTE: Map hreflang alternate URLs here.
        // If your default locale uses localePrefix: 'as-needed', adjust paths to match your URL structure.
        en: `${baseUrl}/en${cleanPath}`,
        es: `${baseUrl}/es${cleanPath}`,
        'x-default': `${baseUrl}${cleanPath}`,
      },
    },
    openGraph: {
      type: 'website',
      // 💡 BOILERPLATE NOTE: Set the default geographic regions for your target audience
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
      // 💡 BOILERPLATE NOTE: Set to false for private projects, internal dashboards, or staging environments
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
            // 💡 BOILERPLATE NOTE: Change defaultTheme to 'dark' or 'light' if your project should not inherit system preference
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
