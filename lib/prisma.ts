import { PrismaClient } from '@prisma/client';

// Reuse a single PrismaClient across requests (and across HMR reloads in dev).
// Creating a new client per request exhausts database connections on serverless,
// and calling $disconnect() mid-flight breaks concurrent requests on warm lambdas.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;
