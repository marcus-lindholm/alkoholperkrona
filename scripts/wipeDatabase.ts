import { PrismaClient } from '@prisma/client';
import readline from 'readline';

const prisma = new PrismaClient();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function wipeDatabase() {
  console.log('⚠️  WARNING: This will delete ALL data from the database ⚠️');
  console.log('This action cannot be undone!');
  
  rl.question('Are you sure you want to proceed? (type "YES" to confirm): ', async (answer) => {
    if (answer !== 'YES') {
      console.log('Operation cancelled. Your database is unchanged.');
      rl.close();
      return;
    }

    try {
      console.log('Starting database wipe...');
      
      // Delete in proper order to respect foreign key constraints
      console.log('Deleting BeverageRanking records...');
      await prisma.beverageRanking.deleteMany({});
      
      console.log('Deleting Beverage records...');
      await prisma.beverage.deleteMany({});
      
      console.log('✅ Database successfully wiped!');
    } catch (error) {
      console.error('❌ Error wiping database:', error);
    } finally {
      await prisma.$disconnect();
      rl.close();
    }
  });
}

wipeDatabase()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });