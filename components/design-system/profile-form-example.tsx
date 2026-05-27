'use client';

import type { ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import { Button, Input } from '@/components/ui';
import { Form, FormField } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Building, Mail, Phone, User } from 'lucide-react';
import { z } from 'zod';

// ─── Schema ───────────────────────────────────────────────────────────────────
const profileSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  email: z.string().min(1, 'El correo es requerido').email('Correo inválido'),
  phone: z.string().optional(),
  company: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

// ─── Interfaces de Props ──────────────────────────────────────────────────────
// 🚀 Agregamos la prop opcional para que el catálogo de componentes no proteste
interface ProfileFormExampleProps {
  onSuccess?: () => void;
}

// ─── Configuración de campos ──────────────────────────────────────────────────
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
export function ProfileFormExample({ onSuccess }: ProfileFormExampleProps) {
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: '', email: '', phone: '', company: '' },
  });

  // Simulamos una petición asíncrona al servidor antes de ejecutar el callback
  async function onSubmit(values: ProfileFormValues) {
    const toastId = toast.loading('Guardando cambios...');

    try {
      console.log('Datos enviados:', values);
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulación de red

      toast.success('¡Perfil actualizado correctamente! ✨', { id: toastId });

      // 🚀 Si nos pasaron la función desde el Dialog, la disparamos para cerrarlo solo
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      toast.error('Hubo un problema al guardar los datos.', { id: toastId });
    }
  }

  return (
    <Form form={form} onSubmit={onSubmit} className="space-y-4 max-w-md w-full">
      {/* ✅ Mapeo limpio — un FormField por cada config */}
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

      <Button type="submit" className="w-full mt-2">
        Guardar perfil
      </Button>
    </Form>
  );
}
