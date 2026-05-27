import { createClient } from '@/lib/supabase/client';

export async function updateAvatarMetadata(publicUrl: string): Promise<void> {
  const supabase = createClient();

  const { error } = await supabase.auth.updateUser({
    data: { avatar_url: publicUrl },
  });

  if (error) {
    throw new Error(
      `Error al actualizar los metadatos del usuario: ${error.message}`,
    );
  }
}
