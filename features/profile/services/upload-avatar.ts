import { createClient } from '@/lib/supabase/client';

export async function uploadAvatar(
  file: File,
  userId: string,
): Promise<string> {
  const supabase = createClient();

  const fileExtension = file.name.split('.').pop();
  const filePath = `${userId}/avatar.${fileExtension}`;

  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: true,
    });

  if (uploadError) {
    throw new Error(`Error al subir la imagen: ${uploadError.message}`);
  }

  // Obtenemos la URL pública del archivo recién subido
  const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);

  if (!data?.publicUrl) {
    throw new Error('No se pudo generar la URL pública del avatar.');
  }

  return data.publicUrl;
}
