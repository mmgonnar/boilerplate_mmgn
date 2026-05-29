'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { Button, Input } from '@/components/ui';
import { Form, FormField } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Lock, Mail } from 'lucide-react';
import { z } from 'zod';

// ─── Schema ───────────────────────────────────────────────────────────────────
const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'El correo es requerido')
    .email('Ingresa un correo válido'),
  password: z
    .string()
    .min(1, 'La contraseña es requerida')
    .min(8, 'Mínimo 8 caracteres'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

// ─── Componente ───────────────────────────────────────────────────────────────
export function LoginFormExample() {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  async function onSubmit() {
    setIsLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 1500));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full max-w-sm space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-foreground">Iniciar sesión</h1>
        <p className="text-sm text-muted-foreground">
          Ingresa tus credenciales para continuar
        </p>
      </div>

      <Form form={form} onSubmit={onSubmit} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field, fieldState }) => (
            <Input
              {...field}
              type="email"
              label="Correo electrónico"
              placeholder="tu@email.com"
              leftIcon={<Mail className="h-4 w-4" />}
              hint="Usa el correo con el que te registraste"
              error={fieldState.error?.message}
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
              label="Contraseña"
              placeholder="••••••••"
              leftIcon={<Lock className="h-4 w-4" />}
              error={fieldState.error?.message}
            />
          )}
        />

        <Button type="submit" className="w-full" isLoading={isLoading}>
          {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
        </Button>
      </Form>
    </div>
  );
}
