'use client';

import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Button, Input } from '@/components/ui';
import { Form, FormField } from '@/components/ui/form';
import { createClient } from '@/lib/supabase/client';
import { apiCallToast } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, ChevronLeft, Info, Lock, Mail } from 'lucide-react';

import {
  type ForgotPasswordFormValues,
  forgotPasswordSchema,
} from '../schemas/forgot-password-schema';

const RESEND_DELAY = 30;

export function ForgotPasswordForm() {
  const t = useTranslations('auth');
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);

  const [submittedEmail, setSubmittedEmail] = useState<string>('');
  const supabase = createClient();

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: 'onTouched',
    defaultValues: { email: '' },
  });

  const startResendCountdown = useCallback(() => {
    setResendCountdown(RESEND_DELAY);
  }, []);

  useEffect(() => {
    if (resendCountdown > 0) {
      const timer = setTimeout(
        () => setResendCountdown(resendCountdown - 1),
        1000,
      );
      return () => clearTimeout(timer);
    }
  }, [resendCountdown]);

  const targetRedirectUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/auth/callback?next=/auth/reset-password`;

  async function onSubmit(values: ForgotPasswordFormValues) {
    setIsLoading(true);

    setSubmittedEmail(values.email);

    const resetPromise = (async () => {
      const { data, error: resetError } =
        await supabase.auth.resetPasswordForEmail(values.email, {
          redirectTo: targetRedirectUrl,
        });

      if (resetError) {
        throw new Error(resetError.message);
      }

      return data;
    })();

    apiCallToast(resetPromise, {
      loading: t('forgot_password.submit_loading'),
      successMessage: t('forgot_password.success_message'),
      errorMessage: t('errors.unexpected_error'),
    });

    await resetPromise.finally(() => {
      setIsLoading(false);
      setIsSubmitted(true);
      form.reset();
      startResendCountdown();
    });
  }

  async function handleResend() {
    if (!submittedEmail) return;

    setIsLoading(true);

    const resendPromise = (async () => {
      const { data, error: resendError } =
        await supabase.auth.resetPasswordForEmail(submittedEmail, {
          redirectTo: targetRedirectUrl,
        });

      if (resendError) {
        throw new Error(resendError.message);
      }

      return data;
    })();

    apiCallToast(resendPromise, {
      loading: t('forgot_password.resend_loading'),
      successMessage: t('forgot_password.resend_success'),
      errorMessage: t('errors.unexpected_error'),
    });

    await resendPromise.finally(() => {
      setIsLoading(false);
      startResendCountdown();
    });
  }

  if (isSubmitted) {
    return (
      <div className="w-full max-w-sm space-y-6">
        <div className="flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Mail className="h-8 w-8 text-primary" />
          </div>
        </div>

        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold text-foreground">
            {t('forgot_password.success_title')}
          </h1>
          <p className="text-sm text-muted-foreground">
            {t('forgot_password.success_subtitle')}
          </p>
        </div>

        <div className="rounded-lg border border-border bg-card p-4">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 shrink-0 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              {t('forgot_password.help_text')}
            </p>
          </div>
        </div>

        <div className="space-y-2 text-center">
          {resendCountdown > 0 ? (
            <p className="text-sm text-muted-foreground">
              {t('forgot_password.resend_countdown', {
                seconds: resendCountdown,
              })}
            </p>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              disabled={isLoading}
              className="text-sm font-medium text-primary hover:underline disabled:opacity-50"
            >
              {t('forgot_password.resend_link')}
            </button>
          )}
        </div>

        <Button
          variant="outline"
          className="w-full"
          onClick={() => setIsSubmitted(false)}
          leftIcon={<ChevronLeft className="h-4 w-4" />}
        >
          {t('forgot_password.try_again')}
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm space-y-6">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.back()}
        leftIcon={<ChevronLeft className="h-4 w-4" />}
        className="-ml-2 h-auto p-1 text-muted-foreground hover:text-foreground"
      >
        {t('forgot_password.back')}
      </Button>

      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Lock className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">
            {t('forgot_password.title')}
          </h1>
        </div>
        <p className="text-sm text-muted-foreground">
          {t('forgot_password.subtitle')}
        </p>
      </div>

      <div className="rounded-lg border border-border bg-card p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 shrink-0 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            {t('forgot_password.info_text')}
          </p>
        </div>
      </div>

      <Form form={form} onSubmit={onSubmit} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field, fieldState }) => (
            <Input
              {...field}
              type="email"
              label={t('data.email')}
              placeholder={t('data.email_placeholder')}
              leftIcon={<Mail className="h-4 w-4" />}
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
            ? t('forgot_password.submit_loading')
            : t('forgot_password.submit')}
        </Button>
      </Form>

      <p className="text-sm text-muted-foreground text-center">
        {t('forgot_password.remember_password')}{' '}
        <Link
          href="/login"
          className="font-medium text-foreground hover:underline"
        >
          {t('forgot_password.sign_in_link')}
        </Link>
      </p>
    </div>
  );
}
