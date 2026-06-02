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

import { RegisterFormValues, registerSchema } from '../schemas/register-schema';
import { REGISTER_FIELDS } from '../utils/constants';

type RegisterFormProps = {
  onSuccess?: () => void;
  redirectTo?: string;
};

export function RegisterForm({ onSuccess, redirectTo }: RegisterFormProps) {
  const t = useTranslations('auth');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: 'onTouched',
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  async function onSubmit(values: RegisterFormValues) {
    setIsLoading(true);

    const signUpPromise = (async () => {
      try {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: values.email,
          password: values.password,
          options: {
            data: { name: values.name },
          },
        });

        if (signUpError) {
          console.error('Error de Supabase:', signUpError);

          const msg = signUpError.message.includes('already registered')
            ? t('errors.email_taken')
            : signUpError.message;

          throw new Error(msg);
        }

        return data;
      } catch (err) {
        console.error('Error en el flujo de registro:', err);
        throw err;
      }
    })();

    apiCallToast(signUpPromise, {
      loading: t('register.submit_loading'),
      successMessage: t('register.success_message'),
      errorMessage: t('errors.unexpected_error'),
      router,
      redirectTo: redirectTo ?? '/dashboard',
    });

    signUpPromise.finally(() => setIsLoading(false));
  }

  return (
    <div className="w-full max-w-sm space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-foreground">
          {t('register.title')}
        </h1>
        <p className="text-sm text-muted-foreground">
          {t('register.subtitle')}
        </p>
      </div>

      <Form form={form} onSubmit={onSubmit} className="space-y-4">
        {REGISTER_FIELDS.map((f) => (
          <FormField
            key={f.name}
            control={form.control}
            name={f.name}
            render={({ field, fieldState }) => (
              <Input
                {...field}
                type={f.type}
                label={t(
                  `data.${f.name === 'confirmPassword' ? 'confirm_password' : f.name}`,
                )}
                placeholder={t(
                  `data.${f.name === 'confirmPassword' ? 'confirm_password' : f.name}${f.name === 'email' ? '_placeholder' : ''}`,
                )}
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

        <Button type="submit" className="w-full mt-4" isLoading={isLoading}>
          {isLoading ? t('register.submit_loading') : t('register.submit')}
        </Button>
      </Form>

      <p className="text-sm text-muted-foreground text-center">
        {t('register.has_account')}{' '}
        <Link
          href="/login"
          className="font-medium text-foreground hover:underline"
        >
          {t('register.sign_in')}
        </Link>
      </p>
    </div>
  );
}
