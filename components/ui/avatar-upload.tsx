'use client';

import * as React from 'react';
import toast from 'react-hot-toast';

import { Avatar } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { Camera, Loader2 } from 'lucide-react';

interface AvatarUploadProps {
  src?: string | null;
  fallbackText?: string;
  isUploading?: boolean;
  onFileSelect: (file: File) => void;
}

export function AvatarUpload({
  src,
  fallbackText,
  isUploading = false,
  onFileSelect,
}: AvatarUploadProps) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleContainerClick = () => {
    if (isUploading) return;
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // ── Validaciones básicas de cliente ────────────────────────────────────────
    if (!file.type.startsWith('image/')) {
      toast.error(
        'Por favor, selecciona un archivo de imagen válido (JPEG, PNG, WEBP).',
      );
      return;
    }

    const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 Megabytes
    if (file.size > MAX_FILE_SIZE) {
      toast.error(
        'La imagen es muy pesada. El tamaño máximo permitido es de 2MB.',
      );
      return;
    }

    onFileSelect(file);

    event.target.value = '';
  };

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Contenedor del Avatar Interactivo */}
      <div
        onClick={handleContainerClick}
        className={cn(
          'relative group rounded-full cursor-pointer overflow-hidden border border-border transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          isUploading
            ? 'cursor-not-allowed opacity-80'
            : 'hover:border-foreground',
        )}
        role="button"
        tabIndex={isUploading ? -1 : 0}
        aria-label="Cambiar foto de perfil"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleContainerClick();
          }
        }}
      >
        {/* Componente Base de Avatar */}
        <Avatar
          src={src}
          fallbackText={fallbackText}
          size="xl"
          className="transition-transform duration-200 group-hover:scale-105"
        />

        {/* Capa de Hover / Estado de Carga */}
        <div
          className={cn(
            'absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white opacity-0 transition-opacity duration-200',
            isUploading
              ? 'opacity-100 bg-black/60'
              : 'group-hover:opacity-100 group-focus-visible:opacity-100',
          )}
        >
          {isUploading ? (
            <Loader2 className="h-6 w-6 animate-spin text-white" />
          ) : (
            <>
              <Camera className="h-6 w-6 mb-1 transform translate-y-2 transition-transform duration-200 group-hover:translate-y-0" />
              <span className="text-[10px] font-mono font-bold tracking-wider uppercase">
                Actualizar
              </span>
            </>
          )}
        </div>
      </div>

      {/* Input de Archivos Oculto Nativo */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/jpeg, image/png, image/webp"
        className="hidden"
        aria-hidden="true"
      />

      <p className="text-xs text-muted-foreground font-mono">
        JPG, PNG o WEBP. Máx 2MB.
      </p>
    </div>
  );
}
