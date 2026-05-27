'use client';

import * as React from 'react';
import toast from 'react-hot-toast';

import { AvatarUpload } from '@/components/ui';

export function UpdateAvatar() {
  const [avatarUrl, setAvatarUrl] = React.useState<string | null>(null);
  const [isUploading, setIsUploading] = React.useState(false);

  const handleAvatarChange = async (file: File) => {
    setIsUploading(true);

    const fakePreviewUrl = URL.createObjectURL(file);
    setAvatarUrl(fakePreviewUrl);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      toast.success('¡Foto de perfil actualizada con éxito! ✨');
    } catch (error) {
      toast.error('Hubo un error al subir la imagen.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="p-6 bg-card border border-border rounded-md max-w-md">
      <h2 className="text-lg font-bold font-mono mb-4 uppercase tracking-wide">
        Perfil de Usuario
      </h2>

      {/* ── Render del componente ────────────────────────────────────────────── */}
      <AvatarUpload
        src={avatarUrl}
        fallbackText="Mariela Gonzalez"
        onFileSelect={handleAvatarChange}
      />
    </div>
  );
}
