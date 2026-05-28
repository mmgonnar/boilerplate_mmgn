import { createClient } from '@/lib/supabase/client';

export async function updateItem(
  id: string,
  updates: { title?: string; description?: string },
) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('items')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`Error al actualizar el registro: ${error.message}`);
  }

  return data;
}
