'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Button, Input } from '@/components/ui';
import { Form, FormField } from '@/components/ui/form';
import { createClient } from '@/lib/supabase/client';
import { apiCallToast } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';

import { type LoginFormValues, loginSchema } from '../schemas/login-schema';
import { LOGIN_FIELDS } from '../utils/constants';

interface LoginFormProps {
  onSuccess?: () => void;
  redirectTo?: string;
}

export function LoginForm({ onSuccess, redirectTo }: LoginFormProps) {
  const t = useTranslations('auth');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: 'onTouched',
    defaultValues: { email: '', password: '' },
  });

  async function onSubmit(values: LoginFormValues) {
    setIsLoading(true);

    // 1. Creamos la promesa para el Toast
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
      successMessage: t('login.success_message') || 'Welcome back!',
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

      <p className="text-sm text-muted-foreground text-center">
        {t('login.no_account')}{' '}
        <Link
          href="/register"
          className="font-medium text-foreground hover:underline"
        >
          {t('login.sign_up')}
        </Link>
      </p>
    </div>
  );
}
