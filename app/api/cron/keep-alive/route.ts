import { NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  const expectedToken = `Bearer ${process.env.CRON_SECRET}`;

  if (!authHeader || authHeader !== expectedToken) {
    return new NextResponse('No autorizado', { status: 401 });
  }

  try {
    await prisma.$queryRawUnsafe('SELECT 1');

    return NextResponse.json({
      success: true,
      message: 'Base de datos despertada con éxito vía GitHub Actions.',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Error en Cron Keep-Alive:', message);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}
