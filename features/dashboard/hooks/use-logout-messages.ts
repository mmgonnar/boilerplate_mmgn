'use client';

import { useTranslations } from 'next-intl';

export type LogoutMessages = {
  loading: string;
  success: string;
  error: string;
};

// Lives in the feature rather than in app/, where the lint config forbids
// next-intl's client hooks outright. Both sign-out surfaces read the same keys.
export function useLogoutMessages(): LogoutMessages {
  const t = useTranslations('dashboard.logout');

  return {
    loading: t('loading'),
    success: t('success'),
    error: t('error'),
  };
}
