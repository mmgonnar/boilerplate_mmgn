import createMiddleware from 'next-intl/middleware';
import { type NextRequest, NextResponse } from 'next/server';

import { createClient } from '@/lib/supabase/middleware';

const PROTECTED_ROUTES = ['/dashboard', '/profile', '/settings'];

const intlMiddleware = createMiddleware({
  locales: ['es', 'en'],
  defaultLocale: 'es',
  localePrefix: 'as-needed',
});

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // 1. Filtrar de inmediato archivos estáticos y recursos del navegador
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') ||
    pathname.endsWith('.ico') ||
    pathname.includes('favicon')
  ) {
    return NextResponse.next();
  }

  // 2. Ejecutar primero el middleware de idiomas para obtener la respuesta base estructurada
  const response = intlMiddleware(request);

  // 3. Inicializar el cliente de Supabase inyectándole la respuesta de idiomas
  // Esto permite que Supabase altere directamente los headers y cookies de la respuesta que sí va al navegador
  const { client: supabase, supabaseResponse } = createClient(
    request,
    response,
  );

  // 4. Leer el usuario autenticado usando el cliente del middleware
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 5. Limpiar el pathname del idioma para validar las rutas protegidas
  const cleanPath =
    pathname.replace(/^\/(es|en)/, '').replace(/\/$/, '') || '/';

  const isProtected = PROTECTED_ROUTES.some(
    (route) => cleanPath === route || cleanPath.startsWith(route + '/'),
  );

  // 6. Si la ruta es protegida y el usuario no existe, redirigir al login
  if (isProtected && !user) {
    const locale = request.cookies.get('NEXT_LOCALE')?.value || 'es';
    const loginUrl = new URL(`/${locale}/login`, request.url);
    const redirectRes = NextResponse.redirect(loginUrl);

    // Copiar las cookies acumuladas hasta ahora a la respuesta de redirección
    supabaseResponse.cookies.getAll().forEach((cookie) => {
      const { name, value, ...options } = cookie;
      redirectRes.cookies.set(name, value, options);
    });

    return redirectRes;
  }

  // 7. Si todo está correcto (es pública o está autenticado), retornar la respuesta mutada por Supabase
  return supabaseResponse;
}

export const config = {
  matcher: [
    '/((?!api|_next|_vercel|auth/callback|auth/reset-password|.*\\..*).*)',
  ],
};
