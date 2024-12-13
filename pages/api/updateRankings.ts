import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function updateRankings() {
  const products = await prisma.beverage.findMany({
    orderBy: {
      apk: 'desc',
    },
  });

  const rankingDate = new Date();

  for (let i = 0; i < products.length; i++) {
    await prisma.beverageRanking.create({
      data: {
        beverageId: products[i].id,
        rankingDate: rankingDate,
        ranking: i + 1,
      },
    });
  }
}

// Schedule this function to run weekly
updateRankings();