'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

import { Button, Input } from '@/components/ui';
import { Form, FormField } from '@/components/ui/form';
import { createClient } from '@/lib/supabase/client';
import { apiCallToast } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { Lock } from 'lucide-react';

import {
  type ResetPasswordFormValues,
  resetPasswordSchema,
} from '../schemas/reset-password-schema';

export function ResetPasswordForm() {
  const t = useTranslations('auth');
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    mode: 'onTouched',
    defaultValues: { password: '', confirmPassword: '' },
  });

  async function onSubmit(values: ResetPasswordFormValues) {
    setIsLoading(true);

    const updatePromise = (async () => {
      const { data, error: updateError } = await supabase.auth.updateUser({
        password: values.password,
      });

      if (updateError) {
        throw new Error(updateError.message);
      }

      return data;
    })();

    apiCallToast(updatePromise, {
      loading: t('reset_password.submit_loading') || 'Updating password...',
      successMessage:
        t('reset_password.success_message') || 'Password updated successfully!',
      errorMessage: t('errors.unexpected_error'),
      router,
      redirectTo: '/login', // ✅ Corregido
    });

    updatePromise.finally(() => setIsLoading(false));
  }

  return (
    <div className="w-full max-w-sm space-y-6">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Lock className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">
            {t('reset_password.title') || 'Reset password'}
          </h1>
        </div>
        <p className="text-sm text-muted-foreground">
          {t('reset_password.subtitle') || 'Enter your new secure password'}
        </p>
      </div>

      <Form form={form} onSubmit={onSubmit} className="space-y-4">
        <FormField
          control={form.control}
          name="password"
          render={({ field, fieldState }) => (
            <Input
              {...field}
              type="password"
              label={t('data.password')}
              placeholder="••••••••"
              leftIcon={<Lock className="h-4 w-4" />}
              error={
                fieldState.error?.message
                  ? t(fieldState.error.message)
                  : undefined
              }
            />
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field, fieldState }) => (
            <Input
              {...field}
              type="password"
              label={t('data.confirm_password')}
              placeholder="••••••••"
              leftIcon={<Lock className="h-4 w-4" />}
              error={
                fieldState.error?.message
                  ? t(fieldState.error.message)
                  : undefined
              }
            />
          )}
        />

        <Button type="submit" className="w-full" isLoading={isLoading}>
          {isLoading
            ? t('reset_password.submit_loading') || 'Updating...'
            : t('reset_password.submit') || 'Update password'}
        </Button>
      </Form>
    </div>
  );
}
