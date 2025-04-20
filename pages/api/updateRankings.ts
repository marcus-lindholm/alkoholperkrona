import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();
let isRunning = false;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const remoteAddress = req.socket.remoteAddress;

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
      },
    });

    console.log(`Fetched ${products.length} products.`);

    const rankingDate = new Date();

    for (let i = 0, currentRanking = 1; i < products.length; i++) {
      // Create a new entry in the BeverageRanking table
      await prisma.beverageRanking.create({
        data: {
          beverageId: products[i].id,
          date: rankingDate,
          ranking: currentRanking,
        },
      });

      console.log(`Updated product ID ${products[i].id} with new ranking: ${currentRanking}`);

      // Update the ranking only if the APK value changes
      if (i < products.length - 1 && products[i].apk !== products[i + 1].apk) {
        currentRanking = i + 2;
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