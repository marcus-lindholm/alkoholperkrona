import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { subMonths } from 'date-fns';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { page, limit, filterType, nestedFilter, filterOrdervara, searchQuery, sortCriteria, sortOrder } = req.query;

  try {
    const pageNumber = parseInt(page as string, 10) || 1;
    const initialLimit = 20;
    const subsequentLimit = parseInt(limit as string, 10) || 50;
    const limitNumber = pageNumber === 1 ? initialLimit : subsequentLimit;

    const skip = pageNumber === 1 
      ? 0 
      : initialLimit + (pageNumber - 2) * subsequentLimit;

    const filters: any = {};

    if (filterType) {
      filters.type = {
        contains: filterType as string,
        mode: 'insensitive',
      };
    }

    if (nestedFilter) {
      filters.AND = filters.AND || [];
      
      if (nestedFilter === 'whiskey') {
        filters.AND.push({
          OR: [
            {
              type: {
                contains: 'whiskey',
                mode: 'insensitive',
              },
            },
            {
              type: {
                contains: 'whisky',
                mode: 'insensitive',
              },
            },
          ],
        });
      } else {
        filters.AND.push({
          type: {
            contains: nestedFilter as string,
            mode: 'insensitive',
          },
        });
      }
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
      let modifiedSearchQuery = searchQuery as string;

      if (modifiedSearchQuery.toLowerCase().includes('nyhet')) {
        filters.AND = filters.AND || [];
        filters.AND.push({
          createdAt: {
            gte: subMonths(new Date(), 1),
          },
        });

        modifiedSearchQuery = modifiedSearchQuery.replace(/nyhet/gi, '').trim();
      }

      if (modifiedSearchQuery) {
        const searchTerms = modifiedSearchQuery.split(' ').filter(term => term);

        const searchFilters = searchTerms.map(term => ({
          OR: [
            { name: { contains: term, mode: 'insensitive' } },
            { brand: { contains: term, mode: 'insensitive' } },
            { type: { contains: term, mode: 'insensitive' } },
            { country: { contains: term, mode: 'insensitive' } },
          ],
        }));

        filters.AND = filters.AND || [];
        filters.AND.push(...searchFilters);
      }
    }

    //console.log('Filters:', JSON.stringify(filters, null, 2));

    const orderBy: any = {};
    if (sortCriteria && sortOrder) {
      orderBy[sortCriteria as string] = sortOrder as string;
    } else {
      orderBy.apk = 'desc'; // Default sorting
    }

    const [products, totalProducts] = await Promise.all([
      prisma.beverage.findMany({
        skip,
        take: limitNumber,
        where: filters,
        orderBy,
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