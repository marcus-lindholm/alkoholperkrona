import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();
let isRunning = false;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const remoteAddress = req.socket.remoteAddress;

  if (process.env.NODE_ENV === 'production') {
    res.status(403).json({ message: "Forbidden: This route cannot be accessed in production." });
    return;
  }

  if (isRunning) {
    console.log("updateRankings is already running. Exiting...");
    res.status(200).json({ message: "updateRankings is already running. Exiting..." });
    return;
  }

  isRunning = true;
  console.log("Starting updateRankings...");

  // try {
  //   const products = await prisma.beverage.findMany({
  //     orderBy: {
  //       apk: 'desc',
  //     },
  //     select: {
  //       id: true,
  //       apk: true,
  //       rankingHistory: true,
  //     },
  //   });

  //   console.log(`Fetched ${products.length} products.`);

  //   const rankingDate = new Date().toISOString().split('T')[0];

  //   for (let i = 0, currentRanking = 1; i < products.length; i++) {
  //     const newRankingEntry = `${rankingDate}:${currentRanking}`;
  //     const updatedRankingHistory = products[i].rankingHistory
  //       ? `${products[i].rankingHistory},${newRankingEntry}`
  //       : newRankingEntry;
    
  //     await prisma.beverage.update({
  //       where: { id: products[i].id },
  //       data: { rankingHistory: updatedRankingHistory },
  //     });
    
  //     console.log(`Updated product ID ${products[i].id} with new ranking entry: ${newRankingEntry}`);
    
  //     if (i < products.length - 1 && products[i].apk !== products[i + 1].apk) {
  //       currentRanking = i + 2;
  //     }
  //   }

  //   console.log("Finished updateRankings.");
  //   res.status(200).json({ message: "Finished updateRankings." });
  // } catch (error) {
  //   console.error("Error updating rankings:", error);
  //   res.status(500).json({ error: "Error updating rankings." });
  // } finally {
  //   isRunning = false;
  //   await prisma.$disconnect();
  // }
}