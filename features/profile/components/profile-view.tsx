'use client';

import * as React from 'react';
import toast from 'react-hot-toast';

import { AvatarUpload } from '@/components/ui';
import { useAuth } from '@/providers/auth-provider';

import { updateAvatarMetadata, uploadAvatar } from '../services';

export function ProfileView() {
  const { user } = useAuth();
  const [isUploading, setIsUploading] = React.useState(false);

  const currentAvatarUrl = user?.user_metadata?.avatar_url || null;

  const userFallbackText = user?.email || 'User';

  const handleAvatarSelect = async (file: File) => {
    if (!user?.id) {
      toast.error('No se encontró una sesión de usuario activa.');
      return;
    }

    setIsUploading(true);
    const toastId = toast.loading('Subiendo tu nueva foto de perfil...');

    try {
      const publicUrl = await uploadAvatar(file, user.id);

      await updateAvatarMetadata(publicUrl);

      toast.success('¡Foto de perfil actualizada con éxito! ✨', {
        id: toastId,
      });
    } catch (error: any) {
      console.error(error);
      toast.error(
        error.message || 'No se pudo actualizar la imagen de perfil.',
        { id: toastId },
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto space-y-6">
      {/* Encabezado de la Sección */}
      <div className="flex flex-col border-b border-border pb-4">
        <h2 className="text-xl font-bold font-mono uppercase tracking-wide text-foreground">
          Ajustes de Cuenta
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Gestiona tu identidad visual y datos de perfil dentro de la
          plataforma.
        </p>
      </div>

      {/* Tarjeta de Gestión de Avatar */}
      <div className="rounded-md border border-border bg-card p-6 shadow-sm flex flex-col items-center md:items-start md:flex-row gap-6">
        <div className="shrink-0">
          <AvatarUpload
            src={currentAvatarUrl}
            fallbackText={userFallbackText}
            isUploading={isUploading}
            onFileSelect={handleAvatarSelect}
          />
        </div>

        <div className="flex-1 flex flex-col justify-center text-center md:text-left space-y-2">
          <h3 className="text-sm font-semibold text-foreground">
            Foto de Perfil
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Esta imagen será visible en las barras de navegación, menús de
            administración y reportes de la aplicación. Se recomienda usar una
            foto cuadrada con buena iluminación.
          </p>
        </div>
      </div>
    </div>
  );
}
