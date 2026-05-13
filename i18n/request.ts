import { getRequestConfig } from 'next-intl/server';

import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as 'es' | 'en')) {
    locale = routing.defaultLocale;
  }

  const [navigation, auth, dashboard, common] = await Promise.all([
    import(`../features/navigation/messages/${locale}.json`),
    import(`../features/auth/messages/${locale}.json`),
    import(`../features/dashboard/messages/${locale}.json`),
    import(`../messages/${locale}.json`),
  ]);

  return {
    locale,
    messages: {
      ...common.default,
      ...auth.default,
      ...navigation.default,
      ...dashboard.default,
    },
  };
});
