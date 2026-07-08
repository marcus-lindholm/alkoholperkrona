import type { NextApiRequest, NextApiResponse } from 'next';
import { setCorsHeaders } from '../../lib/cors';
import prisma from '../../lib/prisma';

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
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (setCorsHeaders(req, res)) return;

  const lastUpdatedDate = await getLastUpdatedDate();
  res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate');
  res.status(200).json({ lastUpdated: lastUpdatedDate });
}