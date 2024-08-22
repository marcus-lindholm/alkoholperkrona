import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { page, limit } = req.query;

  try {
    let products, totalProducts;

    if (!page && !limit) {
      [products, totalProducts] = await Promise.all([
        prisma.beverage.findMany({
          orderBy: {
            apk: 'desc',
          },
        }),
        prisma.beverage.count(),
      ]);
    } else {
      const pageNumber = parseInt(page as string, 10) || 1;
      const limitNumber = pageNumber === 1 ? 6000 : parseInt(limit as string, 10) || 50;
      const skip = (pageNumber - 1) * limitNumber;

      [products, totalProducts] = await Promise.all([
        prisma.beverage.findMany({
          skip,
          take: limitNumber,
          orderBy: {
            apk: 'desc',
          },
        }),
        prisma.beverage.count(),
      ]);
    }

    const totalPages = Math.ceil(totalProducts / (limit ? parseInt(limit as string, 10) : 50));

    res.status(200).json({ products, totalPages });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  } finally {
    await prisma.$disconnect();
  }
}