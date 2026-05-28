-- 1. Crear tabla genérica de ejemplo (puedes renombrar 'items' por 'students', 'courses', etc.)
CREATE TABLE IF NOT EXISTS public.items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. Habilitar Row Level Security (RLS) obligatoriamente
ALTER TABLE public.items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuarios pueden ver sus propios items" 
  ON public.items FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden crear sus propios items" 
  ON public.items FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden actualizar sus propios items" 
  ON public.items FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden borrar sus propios items" 
  ON public.items FOR DELETE 
  USING (auth.uid() = user_id);