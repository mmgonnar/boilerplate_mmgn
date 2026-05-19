'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Button, Input } from '@/components/ui';
import { Form, FormField } from '@/components/ui/form';
import { createClient } from '@/lib/supabase/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Lock, Mail } from 'lucide-react';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().min(1).email(),
  password: z.string().min(1),
});

type LoginFormValues = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onSuccess?: () => void;
  redirectTo?: string;
}

export function LoginForm({ onSuccess, redirectTo }: LoginFormProps) {
  const t = useTranslations('auth');
  // const tLogin = useTranslations('login');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  async function onSubmit(values: LoginFormValues) {
    setIsLoading(true);
    setError(null);

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (signInError) {
        setError(t('errors.invalid_credentials'));
        return;
      }

      if (onSuccess) {
        onSuccess();
      } else {
        router.push(redirectTo ?? '/dashboard');
        router.refresh();
      }
    } catch {
      setError(t('errors.invalid_credentials'));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full max-w-sm space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-foreground">
          {t('login.title')}
        </h1>
        <p className="text-sm text-muted-foreground">{t('login.subtitle')}</p>
      </div>

      {error && (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <Form form={form} onSubmit={onSubmit} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field, fieldState }) => (
            <Input
              {...field}
              type="email"
              label={t('data.email')}
              placeholder="tu@email.com"
              leftIcon={<Mail className="h-4 w-4" />}
              error={fieldState.error?.message && t('errors.invalid_email')}
            />
          )}
        />

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
              error={fieldState.error?.message && t('errors.required_field')}
            />
          )}
        />

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
