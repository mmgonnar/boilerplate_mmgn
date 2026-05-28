// lib/prisma.ts
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';

const createPrismaClient = () => {
  if (!process.env.DATABASE_URL) {
    return new Proxy({} as any, {
      get() {
        return () => {
          throw new Error(
            'Prisma no está configurado ni disponible en el modo de Solo Landing.',
          );
        };
      },
    });
  }

  const connectionString = process.env.DATABASE_URL;

  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);

  return new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
  });
};

declare global {
  // eslint-disable-next-line no-var
  var prisma: undefined | ReturnType<typeof createPrismaClient>;
}

export const prisma = globalThis.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma;
