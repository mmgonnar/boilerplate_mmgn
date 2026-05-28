'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import { useTranslations } from 'next-intl';

import {
  AvatarUpload,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
} from '@/components/ui';
import { useAuth } from '@/providers/auth-provider';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Shield, User } from 'lucide-react';
import { z } from 'zod';

import {
  updateAvatarMetadata,
  uploadAvatar,
} from '@/features/profile/services';

// Schema de validación para los datos editables del usuario
const profileSettingsSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  email: z.string().email('Correo inválido'), // El correo suele ser de solo lectura, pero sirve mostrarlo
});

type ProfileSettingsValues = z.infer<typeof profileSettingsSchema>;

export default function ProfilePage() {
  const { user } = useAuth();
  const [isUploading, setIsUploading] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);

  // Inicializamos el formulario
  const form = useForm<ProfileSettingsValues>({
    resolver: zodResolver(profileSettingsSchema),
    defaultValues: {
      name: '',
      email: '',
    },
  });

  // Sincronizar los datos de Supabase Auth con el formulario cuando cargue la sesión
  React.useEffect(() => {
    if (user) {
      form.reset({
        name: user.user_metadata?.full_name || user.user_metadata?.name || '',
        email: user.email || '',
      });
    }
  }, [user, form]);

  if (!user) return null;

  // ─── Manejo del Avatar ─────────────────────────────────────────────────────
  const handleAvatarSelect = async (file: File) => {
    setIsUploading(true);
    const toastId = toast.loading('Subiendo imagen de perfil...');
    try {
      const publicUrl = await uploadAvatar(file, user.id);
      await updateAvatarMetadata(publicUrl);
      toast.success('¡Foto de perfil actualizada! ✨', { id: toastId });
    } catch (error: any) {
      toast.error(error.message || 'Error al subir la imagen.', {
        id: toastId,
      });
    } finally {
      setIsUploading(false);
    }
  };

  // ─── Manejo de los Datos del Formulario ────────────────────────────────────
  const onSaveProfile = async (values: ProfileSettingsValues) => {
    setIsSaving(true);
    const toastId = toast.loading('Guardando cambios...');

    try {
      const { createClient } = await import('@/lib/supabase/client');
      const supabase = createClient();

      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: values.name,
          avatar_url: user.user_metadata?.avatar_url || '',
        },
      });

      if (error) throw error;

      toast.success('¡Perfil actualizado con éxito! ✨', { id: toastId });
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || 'No se pudieron guardar los cambios.', {
        id: toastId,
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full max-w-4xl  animate-in fade-in duration-300">
      {/* Título de la página */}
      <div className="flex flex-col border-b border-border pb-4">
        <h1 className="text-2xl font-bold font-mono uppercase tracking-wide">
          Mi Perfil
        </h1>
        <p className="text-sm text-muted-foreground">
          Administra tu información personal y configuración de cuenta.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        {/* Columna Izquierda: Foto de Perfil */}
        <Card className="md:col-span-1 border-border">
          <CardHeader className="text-center">
            <CardTitle className="text-sm font-mono uppercase tracking-wider text-muted-foreground">
              Avatar
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center pb-6">
            <AvatarUpload
              src={user.user_metadata?.avatar_url}
              fallbackText={user.email}
              isUploading={isUploading}
              onFileSelect={handleAvatarSelect}
            />
          </CardContent>
        </Card>

        {/* Columna Derecha: Formulario de Datos */}
        <Card className="md:col-span-2 border-border">
          <CardHeader>
            <CardTitle>Detalles de la Cuenta</CardTitle>
            <CardDescription>
              Modifica tu nombre público o visualiza las credenciales de acceso.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={form.handleSubmit(onSaveProfile)}
              className="space-y-4"
            >
              <Input
                {...form.register('name')}
                label="Nombre Público"
                placeholder="Tu nombre completo"
                leftIcon={<User className="h-4 w-4" />}
                error={form.formState.errors.name?.message}
              />

              <Input
                {...form.register('email')}
                label="Correo Electrónico"
                disabled
                hint="El correo electrónico no puede ser modificado por motivos de seguridad."
                leftIcon={<Mail className="h-4 w-4" />}
              />

              <div className="flex justify-end pt-4">
                <Button
                  type="submit"
                  isLoading={isSaving}
                  className="w-full sm:w-auto px-6"
                >
                  Guardar Cambios
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
