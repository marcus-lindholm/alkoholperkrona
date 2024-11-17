import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getLastUpdatedDate(): Promise<string | null> {
  try {
    const latestProduct = await prisma.beverage.findFirst({
      orderBy: {
        updatedAt: 'desc',
      },
      select: {
        updatedAt: true,
      },
    });

    if (latestProduct && latestProduct.updatedAt) {
      return latestProduct.updatedAt.toISOString();
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error fetching the latest updated date:', error);
    return null;
  } finally {
    await prisma.$disconnect();
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const lastUpdatedDate = await getLastUpdatedDate();
  res.status(200).json({ lastUpdated: lastUpdatedDate });
}