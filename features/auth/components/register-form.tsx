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
import { Lock, Mail, User } from 'lucide-react';

import { RegisterFormValues, registerSchema } from '../schemas/register-schema';
import { REGISTER_FIELDS } from '../utils/constants';

//import { z } from 'zod';

// const registerSchema = z
//   .object({
//     name: z.string().min(1),
//     email: z.string().min(1).email(),
//     password: z.string().min(8),
//     confirmPassword: z.string().min(1),
//   })
//   .refine((data) => data.password === data.confirmPassword, {
//     message: 'errors.passwords_dont_match',
//     path: ['confirmPassword'],
//   });

// type RegisterFormValues = z.infer<typeof registerSchema>;

interface RegisterFormProps {
  onSuccess?: () => void;
  redirectTo?: string;
}

export function RegisterForm({ onSuccess, redirectTo }: RegisterFormProps) {
  const t = useTranslations('auth');
  const [error, setError] = useState<string | null>(null);
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
    setError(null);

    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            name: values.name,
          },
        },
      });

      if (signUpError) {
        if (signUpError.message.includes('already registered')) {
          setError(t('errors.email_taken'));
        } else {
          setError(signUpError.message);
        }
        return;
      }

      if (onSuccess) {
        onSuccess();
      } else {
        router.push(redirectTo ?? '/login');
        router.refresh();
      }
    } catch {
      setError('errors.unexpected_error');
    } finally {
      setIsLoading(false);
    }
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

      {error && (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

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

        <Button type="submit" className="w-full" isLoading={isLoading}>
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
