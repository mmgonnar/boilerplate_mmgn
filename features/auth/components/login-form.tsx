'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { useTranslations } from 'next-intl';
import Link from 'next/link';

import { Button, Form, FormField, Input } from '@/components/ui';
import { useRouter } from '@/i18n/navigation';
import { createClient } from '@/lib/supabase/client';
import { apiCallToast } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';

import { type LoginFormValues, loginSchema } from '../schemas/login-schema';
import { signInWithOAuth } from '../services/oauth-service';
import { LOGIN_FIELDS } from '../utils/constants';

type LoginFormProps = {
  onSuccess?: () => void;
  redirectTo?: string;
  showRegisterLink?: boolean;
  theme?: 'light' | 'dark';
};

export function LoginForm({
  onSuccess: _onSuccess,
  redirectTo,
  showRegisterLink = true,
  theme,
}: LoginFormProps) {
  const t = useTranslations('auth');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: 'onTouched',
    defaultValues: { email: '', password: '' },
  });
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const handleGoogleLogin = async () => {
    if (isGoogleLoading) return;

    setIsGoogleLoading(true);

    apiCallToast(signInWithOAuth('google'), {
      loading: 'Redirigiendo a Google...',
      successMessage: 'Conexión con Google exitosa',
      errorMessage: 'No se pudo conectar con Google. Inténtalo de nuevo.',
    }).finally(() => {
      setIsGoogleLoading(false);
    });
  };

  async function onSubmit(values: LoginFormValues) {
    setIsLoading(true);

    const signInPromise = (async () => {
      const { data, error: signInError } =
        await supabase.auth.signInWithPassword({
          email: values.email,
          password: values.password,
        });

      if (signInError) {
        throw new Error(t('errors.invalid_credentials'));
      }

      return data;
    })();

    apiCallToast(signInPromise, {
      loading: t('login.submit_loading'),
      successMessage: t('login.welcome') || t('login.welcome_back'),
      errorMessage: t('errors.invalid_credentials'),
      router,
      redirectTo: redirectTo ?? '/dashboard',
    });

    signInPromise.finally(() => setIsLoading(false));
  }

  return (
    <div className="w-full max-w-sm space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-foreground">
          {t('login.title')}
        </h1>
        <p className="text-sm text-muted-foreground">{t('login.subtitle')}</p>
      </div>

      <Form form={form} onSubmit={onSubmit} className="space-y-4">
        {LOGIN_FIELDS.map((f) => (
          <FormField
            key={f.name}
            control={form.control}
            name={f.name}
            render={({ field, fieldState }) => (
              <Input
                {...field}
                type={f.type}
                label={t(`data.${f.name}`)}
                placeholder={t(`data.${f.name}`)}
                leftIcon={<f.icon className="h-4 w-4" />}
                error={
                  fieldState.error?.message
                    ? t(fieldState.error.message)
                    : undefined
                }
              />
            )}
          />
        ))}

        <div className="flex items-center justify-end">
          <Link
            href="/forgot-password"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            {t('login.forgot_password')}
          </Link>
        </div>

        <Button type="submit" className="w-full" isLoading={isLoading}>
          {isLoading ? t('login.submit_loading') : t('login.submit')}
        </Button>
      </Form>

      {showRegisterLink && (
        <p className="text-sm text-muted-foreground text-center">
          {t('login.no_account')}{' '}
          <Link
            href="/register"
            className="font-medium text-foreground hover:underline"
          >
            {t('login.sign_up')}
          </Link>
        </p>
      )}

      <div className="relative my-4 flex items-center justify-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border"></div>
        </div>
        <span className="relative bg-card px-2 text-xs text-muted-foreground uppercase">
          O continuar con
        </span>
      </div>

      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={handleGoogleLogin}
        disabled={isGoogleLoading}
      >
        {isGoogleLoading ? 'Cargando...' : 'Continuar con Google'}
      </Button>
    </div>
  );
}
