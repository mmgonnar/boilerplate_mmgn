import { createClient } from '@/lib/supabase/client';

export async function createItem(title: string, description?: string) {
  const supabase = createClient();

  // Obtenemos la sesión actual para amarrar el user_id de forma segura
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('No hay una sesión de usuario activa.');

  const { data, error } = await supabase
    .from('items')
    .insert([{ title, description, user_id: user.id }])
    .select()
    .single();

  if (error) {
    throw new Error(`Error al crear el registro: ${error.message}`);
  }

  return data;
}
