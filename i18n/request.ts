import { getRequestConfig } from 'next-intl/server';

import commonEn from '@/messages/en.json';
import commonEs from '@/messages/es.json';

import authEn from '@/features/auth/messages/en.json';
import authEs from '@/features/auth/messages/es.json';
import dashboardEn from '@/features/dashboard/messages/en.json';
import dashboardEs from '@/features/dashboard/messages/es.json';
import navigationEn from '@/features/navigation/messages/en.json';
import navigationEs from '@/features/navigation/messages/es.json';

import { routing } from './routing';

const messages: Record<string, Record<string, any>> = {
  en: { ...commonEn, ...authEn, ...navigationEn, ...dashboardEn },
  es: { ...commonEs, ...authEs, ...navigationEs, ...dashboardEs },
};

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as 'es' | 'en')) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: messages[locale] || messages[routing.defaultLocale],
  };
});
