'use client';

import type { ReactNode } from 'react';
import { useForm } from 'react-hook-form';

import { Button, Input } from '@/components/ui';
import { Form, FormField } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Building, Mail, Phone, User } from 'lucide-react';
import { z } from 'zod';

// ─── Schema ───────────────────────────────────────────────────────────────────
const profileSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  email: z.string().min(1, 'El correo es requerido').email('Correo inválido'),
  phone: z.string().min(10, 'Teléfono inválido').optional(),
  company: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

// ─── Configuración de campos ──────────────────────────────────────────────────
// ✅ Los campos como dato — agregar uno nuevo es solo añadir un objeto al array
type FieldConfig = {
  name: keyof ProfileFormValues;
  label: string;
  placeholder: string;
  type?: string;
  icon: ReactNode;
  hint?: string;
};

const PROFILE_FIELDS: FieldConfig[] = [
  {
    name: 'name',
    label: 'Nombre completo',
    placeholder: 'Mariela Gonzalez',
    icon: <User className="h-4 w-4" />,
  },
  {
    name: 'email',
    label: 'Correo electrónico',
    placeholder: 'mmgonnar@mail.com',
    type: 'email',
    icon: <Mail className="h-4 w-4" />,
    hint: 'Nunca compartiremos tu correo',
  },
  {
    name: 'phone',
    label: 'Teléfono',
    placeholder: '+52 55 0000 0000',
    type: 'tel',
    icon: <Phone className="h-4 w-4" />,
  },
  {
    name: 'company',
    label: 'Empresa',
    placeholder: 'MMGN Inc.',
    icon: <Building className="h-4 w-4" />,
  },
];

// ─── Componente ───────────────────────────────────────────────────────────────
export function ProfileFormExample() {
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: '', email: '', phone: '', company: '' },
  });

  function onSubmit(values: ProfileFormValues) {
    console.log(values);
  }

  return (
    <Form form={form} onSubmit={onSubmit} className="space-y-4 max-w-md">
      {/* ✅ mapeo limpio — un FormField por cada config */}
      {PROFILE_FIELDS.map((fieldConfig) => (
        <FormField
          key={fieldConfig.name}
          control={form.control}
          name={fieldConfig.name}
          render={({ field, fieldState }) => (
            <Input
              {...field}
              type={fieldConfig.type ?? 'text'}
              label={fieldConfig.label}
              placeholder={fieldConfig.placeholder}
              leftIcon={fieldConfig.icon}
              hint={fieldConfig.hint}
              error={fieldState.error?.message}
            />
          )}
        />
      ))}

      <Button type="submit" className="w-full">
        Guardar perfil
      </Button>
    </Form>
  );
}
