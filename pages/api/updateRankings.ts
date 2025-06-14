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
    let currentRank = 1; // Start with rank 1
    let sameApkCount = 0; // Count products with the same APK
    let lastProcessedAPK: number | null = null;

    for (let i = 0; i < products.length; i++) {
      const product = products[i];

      // If this is a new APK value
      if (lastProcessedAPK !== null && product.apk !== lastProcessedAPK) {
        // Next rank should skip ahead by the number of products with the same previous APK
        currentRank = i + 1; // Position in the array + 1 gives the correct next rank
        sameApkCount = 0;
      } else if (lastProcessedAPK === product.apk) {
        // Same APK as previous, increment counter but keep rank the same
        sameApkCount++;
      }

      lastProcessedAPK = product.apk;

      // Check the last stored ranking for this product
      const lastRanking = await prisma.beverageRanking.findFirst({
        where: { beverageId: product.id },
        orderBy: { date: 'desc' },
      });

      if (lastRanking) {
        // If the APK didn't change
        if (lastRanking.apk === product.apk) {
          // Update ranking if it's different; otherwise skip
          if (lastRanking.ranking === currentRank) {
            console.log(
              `Skipping product ID ${product.id}, rank ${currentRank}, apk ${product.apk} as both apk and rank have not changed.`
            );
            continue;
          } else {
            // Update the existing entry with the new rank
            await prisma.beverageRanking.update({
              where: { id: lastRanking.id },
              data: {
                ranking: currentRank,
              },
            });
            console.log(
              `Updated existing record for product ID ${product.id} with new ranking: ${currentRank}, apk: ${product.apk}`
            );
            continue;
          }
        }
      }

      // If there's no last ranking or the APK has changed, create a new entry
      await prisma.beverageRanking.create({
        data: {
          beverageId: product.id,
          date: rankingDate,
          ranking: currentRank,
          apk: product.apk,
          price: product.price,
        },
      });
      console.log(
        `Created new ranking record for product ID ${product.id}: ranking ${currentRank}, apk ${product.apk}, price ${product.price}`
      );
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