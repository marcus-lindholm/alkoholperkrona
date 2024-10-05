import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { page, limit, filterType, nestedFilter, filterOrdervara, searchQuery } = req.query;

  try {
    const pageNumber = parseInt(page as string, 10) || 1;
    const limitNumber = pageNumber === 1 ? 20 : parseInt(limit as string, 10) || 50;
    const skip = (pageNumber - 1) * limitNumber;

    const filters: any = {};

    if (filterType) {
      filters.type = {
        contains: filterType as string,
        mode: 'insensitive',
      };
    }

    if (nestedFilter) {
      filters.AND = filters.AND || [];
      filters.AND.push({
        type: {
          contains: nestedFilter as string,
          mode: 'insensitive',
        },
      });
    }

    if (filterOrdervara === 'false') {
      filters.AND = filters.AND || [];
      filters.AND.push({
        type: {
          not: {
            contains: 'ordervara',
          },
        },
      });
    }

    if (searchQuery) {
      filters.OR = [
        { name: { contains: searchQuery as string, mode: 'insensitive' } },
        { brand: { contains: searchQuery as string, mode: 'insensitive' } },
        { type: { contains: searchQuery as string, mode: 'insensitive' } },
      ];
    }

    console.log('Filters:', filters);

    const [products, totalProducts] = await Promise.all([
      prisma.beverage.findMany({
        skip,
        take: limitNumber,
        where: filters,
        orderBy: {
          apk: 'desc',
        },
      }),
      prisma.beverage.count({
        where: filters,
      }),
    ]);

    const totalPages = Math.ceil(totalProducts / limitNumber);

    res.status(200).json({ products, totalPages });
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error fetching products:', error.message);
      res.status(500).json({ error: 'Failed to fetch products', message: error.message });
    } else {
      console.error('Unknown error fetching products');
      res.status(500).json({ error: 'Failed to fetch products', message: 'Unknown error occurred' });
    }
  } finally {
    await prisma.$disconnect();
  }
}