import { NextApiRequest, NextApiResponse } from 'next';
import { subMonths } from 'date-fns';
import { setCorsHeaders } from '../../lib/cors';
import prisma from '../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (setCorsHeaders(req, res)) return;

  const {
    page,
    limit,
    filterType,
    nestedFilter,
    filterOrdervara,
    searchQuery,
    sortCriteria,
    sortOrder,
    random,
    isGlutenFree,
  } = req.query;

  try {
    // Handle random product fetching
    if (random === 'true') {
      const glutenFreeCondition =
        isGlutenFree === 'true'
          ? `AND ("type" NOT LIKE '%beer%' OR "name" ILIKE '%gluten%' OR "brand" ILIKE '%gluten%')`
          : '';

      const randomProducts = await prisma.$queryRawUnsafe(`
        SELECT id, brand, name, apk, type, alcohol, volume, price, url, img, vpk
        FROM "Beverage"
        WHERE "type" NOT LIKE '%Ordervaror%'
        AND "img" IS NOT NULL AND "img" != ''
        ${glutenFreeCondition}
        ORDER BY RANDOM()
        LIMIT 20
      `);
      res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
      res.status(200).json(randomProducts);
      return;
    }

    // Pagination and limits (clamped so a single request can't sweep the whole table)
    const pageNumber = Math.max(parseInt(page as string, 10) || 1, 1);
    const limitNumber = Math.min(Math.max(parseInt(limit as string, 10) || 20, 1), 100);
    const skip = (pageNumber - 1) * limitNumber;

    // Filters
    const filters: any = {};

    if (filterType) {
      filters.type = {
        startsWith: `${filterType},`,
        mode: 'insensitive',
      };
    }

    if (nestedFilter) {
      filters.AND = filters.AND || [];
      if (nestedFilter === 'whiskey') {
        filters.AND.push({
          OR: [
            { type: { contains: 'whiskey', mode: 'insensitive' } },
            { type: { contains: 'whisky', mode: 'insensitive' } },
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
            contains: 'Ordervaror',
          },
        },
      });
    }

    if (searchQuery) {
      let modifiedSearchQuery = searchQuery as string;

      // Handle "nyhet" keyword
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

    if (isGlutenFree === 'true') {
      filters.AND = filters.AND || [];
      filters.AND.push({
        OR: [
          {
            type: {
              not: {
                startsWith: 'beer,',
              },
            },
          },
          {
            name: {
              contains: 'gluten',
              mode: 'insensitive',
            },
          },
          {
            brand: {
              contains: 'gluten',
              mode: 'insensitive',
            },
          },
        ],
      });
    }

    // Sorting
    const orderBy: any = {};
    if (sortCriteria && sortOrder) {
      orderBy[sortCriteria as string] = sortOrder as string;
    } else {
      orderBy.apk = 'desc'; // Default sorting
    }

    // Fetch products
    const [products, totalProducts] = await Promise.all([
      prisma.beverage.findMany({
        skip,
        take: limitNumber,
        where: filters,
        orderBy,
        select: {
          id: true,
          brand: true,
          name: true,
          apk: true,
          type: true,
          alcohol: true,
          volume: true,
          price: true,
          url: true,
          vpk: true,
          img: true,
          createdAt: true,
          BeverageRanking: {
            orderBy: {
              date: 'desc', // Order by most recent date
            },
            select: {
              date: true,
              ranking: true,
              apk: true,
            },
          },
        },
      }),
      prisma.beverage.count({
        where: filters,
      }),
    ]);

    const totalPages = Math.ceil(totalProducts / limitNumber);

    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
    res.status(200).json({ products, totalPages });
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error fetching products:', error.message);
      res.status(500).json({ error: 'Failed to fetch products', message: error.message });
    } else {
      console.error('Unknown error fetching products');
      res.status(500).json({ error: 'Failed to fetch products', message: 'Unknown error occurred' });
    }
  }
}