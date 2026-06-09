'use client';

import { useState } from 'react';

import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui';
import { apiCallToast } from '@/lib/utils';
import { type Provider } from '@supabase/supabase-js';

import { signInWithOAuth } from '../services/oauth-service';
import { GithubIcon, GoogleIcon } from './auth-icons';

const OAUTH_ICONS = {
  google: GoogleIcon,
  github: GithubIcon,
  //   apple: AppleIcon,
};
const OAUTH_PROVIDERS = ['google', 'github'] as const;

type OAuthProvidersProps = {
  mode: 'login' | 'register';
};

export function OAuthProviders({ mode }: OAuthProvidersProps) {
  const t = useTranslations('auth');
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);

  const handleOAuth = (provider: Provider) => {
    if (loadingProvider) return;
    setLoadingProvider(provider);

    apiCallToast(signInWithOAuth(provider), {
      loading: t(`oauth.${provider}_loading`),
      successMessage: t(`oauth.${provider}_success`),
      errorMessage: t(`oauth.${provider}_error`),
    }).finally(() => setLoadingProvider(null));
  };

  return (
    <div className="space-y-3 md:flex md:flex-row md:gap-3 md:space-y-0 md:justify-center">
      {OAUTH_PROVIDERS.map((provider) => {
        const Icon = OAUTH_ICONS[provider];
        return (
          <Button
            key={provider}
            type="button"
            variant="outline"
            className="w-full md:w-auto md:px-3 md:gap-0"
            onClick={() => handleOAuth(provider as Provider)}
            disabled={loadingProvider !== null}
            isLoading={loadingProvider === provider}
            leftIcon={<Icon className="h-5 w-5" />}
            size="default"
          >
            <span className="md:sr-only">{t(`${mode}.oauth_${provider}`)}</span>
          </Button>
        );
      })}
    </div>
  );
}
