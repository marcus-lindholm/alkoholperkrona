import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();
let isRunning = false;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (process.env.NODE_ENV === 'production') {
    res.status(403).json({ message: "Forbidden: This route cannot be accessed." });
    return;
  }

  if (isRunning) {
    console.log("updateRankings is already running. Exiting...");
    res.status(200).json({ message: "updateRankings is already running. Exiting..." });
    return;
  }

  isRunning = true;
  console.log("Starting updateRankings...");

  try {
    const products = await prisma.beverage.findMany({
      orderBy: {
        apk: 'desc',
      },
      select: {
        id: true,
        apk: true,
        price: true,
      },
    });

    console.log(`Fetched ${products.length} products.`);

    const rankingDate = new Date();
    let currentRanking = 1; // Initialize currentRanking

    for (let i = 0; i < products.length; i++) {
      const product = products[i];

      // Check the last entry for this product in the BeverageRanking table
      const lastRanking = await prisma.beverageRanking.findFirst({
        where: { beverageId: product.id },
        orderBy: { date: 'desc' },
      });

      // If the product is skipped, log its rank and continue
      if (lastRanking && lastRanking.ranking === currentRanking) {
        console.log(`Skipping product ID ${product.id}, rank ${currentRanking}, apk ${product.apk} as apk has not changed.`);
      } else {
        // Create a new entry in the BeverageRanking table
        await prisma.beverageRanking.create({
          data: {
            beverageId: product.id,
            date: rankingDate,
            ranking: currentRanking,
            apk: product.apk,
            price: product.price,
          },
        });

        console.log(`Updated product ID ${product.id} with new ranking: ${currentRanking}, apk: ${product.apk}, price: ${product.price}`);
      }

      // Increment the rank only if the next product has a different APK
      if (i < products.length - 1 && products[i + 1].apk !== product.apk) {
        currentRanking++;
      }
    }

    console.log("Finished updateRankings.");
    res.status(200).json({ message: "Finished updateRankings." });
  } catch (error) {
    console.error("Error updating rankings:", error);
    res.status(500).json({ error: "Error updating rankings." });
  } finally {
    isRunning = false;
    await prisma.$disconnect();
  }
}