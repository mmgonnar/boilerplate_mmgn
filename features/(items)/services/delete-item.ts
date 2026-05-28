import { createClient } from '@/lib/supabase/client';

export async function deleteItem(id: string) {
  const supabase = createClient();

  const { error } = await supabase.from('items').delete().eq('id', id);

  if (error) {
    throw new Error(`Error al eliminar el registro: ${error.message}`);
  }

  return true;
}
