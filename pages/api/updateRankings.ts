import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();
let isRunning = false;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
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
    });

    console.log(`Fetched ${products.length} products.`);

    const rankingDate = new Date().toISOString().split('T')[0]; // Format date as YYYY-MM-DD

    for (let i = 0; i < products.length; i++) {
      const newRankingEntry = `${rankingDate}:${i + 1}`;
      const updatedRankingHistory = products[i].rankingHistory
        ? `${products[i].rankingHistory},${newRankingEntry}`
        : newRankingEntry;

      await prisma.beverage.update({
        where: { id: products[i].id },
        data: { rankingHistory: updatedRankingHistory },
      });

      console.log(`Updated product ID ${products[i].id} with new ranking entry: ${newRankingEntry}`);
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