import type { AbstractIntlMessages } from 'next-intl';
import { getRequestConfig } from 'next-intl/server';

import commonEn from '@/messages/en.json';
import commonEs from '@/messages/es.json';

import authEn from '@/features/auth/messages/en.json';
import authEs from '@/features/auth/messages/es.json';
import dashboardEn from '@/features/dashboard/messages/en.json';
import dashboardEs from '@/features/dashboard/messages/es.json';
import navigationEn from '@/features/navigation/messages/en.json';
import navigationEs from '@/features/navigation/messages/es.json';
import profileEn from '@/features/profile/messages/en.json';
import profileEs from '@/features/profile/messages/es.json';

import { routing } from './routing';

const messages: Record<string, AbstractIntlMessages> = {
  en: { ...commonEn, ...authEn, ...navigationEn, ...dashboardEn, ...profileEn },
  es: { ...commonEs, ...authEs, ...navigationEs, ...dashboardEs, ...profileEs },
};

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  const supportedLocales: readonly string[] = routing.locales;

  if (!locale || !supportedLocales.includes(locale)) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: messages[locale] || messages[routing.defaultLocale],
  };
});
