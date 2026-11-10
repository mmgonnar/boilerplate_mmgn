import { createClient } from '@/lib/supabase/client';

// A plain service cannot call a translation hook, so it throws the message KEY
// and the component that caught it does the lookup, via isAvatarErrorKey below.
export const AVATAR_ERROR_KEYS = {
  uploadFailed: 'profile.errors.avatar_upload_failed',
  publicUrlMissing: 'profile.errors.avatar_url_failed',
} as const;

export function isAvatarErrorKey(value: unknown): value is Error {
  return (
    value instanceof Error &&
    (Object.values(AVATAR_ERROR_KEYS) as string[]).includes(value.message)
  );
}

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
    // The driver message rides along on cause, so nothing diagnostic is lost.
    throw new Error(AVATAR_ERROR_KEYS.uploadFailed, { cause: uploadError });
  }

  // Read the public URL of the file we just uploaded
  const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);

  if (!data?.publicUrl) {
    throw new Error(AVATAR_ERROR_KEYS.publicUrlMissing);
  }

  return data.publicUrl;
}
