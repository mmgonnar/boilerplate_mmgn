import { createClient } from '@/lib/supabase/client';

export async function getItems() {
  const supabase = createClient();

  // Trae los datos ordenados del más reciente al más viejo
  const { data, error } = await supabase
    .from('items')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Error al obtener los datos: ${error.message}`);
  }

  return data;
}
