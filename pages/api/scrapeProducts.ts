import { PrismaClient } from '@prisma/client';
import { sendEmail } from '../../lib/emailService';
import axios from 'axios';

const prisma = new PrismaClient();
let allFetchedProducts: string[] = [];

export default async function handler(req: any, res: any) {
  if (process.env.NODE_ENV === 'production') {
    res.status(403).json({ message: "Forbidden: This route cannot be accessed." });
    return;
  }
  
  console.log("scrapeProducts API called");
  if (req.method === 'GET') {
    try {
      await fetchAndProcessProducts();
      res.status(200).json({ message: 'Products fetched and processed successfully' });
    } catch (error) {
      let errorMessage = 'An unknown error occurred';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      // Send an email notification
      await sendEmail('Product Fetch Failed for APKrona.se', `The API fetch failed with the following error: ${errorMessage}`);
      res.status(500).json({ message: 'API fetch failed', error: errorMessage });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}

async function fetchAndProcessProducts() {
  console.time('fetchAndProcessProducts run time');
  allFetchedProducts = [];
  
  try {
    console.log('Fetching products from API...');
    const response = await axios.get('https://susbolaget.emrik.org/v1/products');
    
    if (!response.data || !Array.isArray(response.data)) {
      throw new Error('Invalid API response format');
    }
    
    const products = response.data;
    console.log(`Fetched ${products.length} products from API`);
    
    await processProducts(products);
    await deleteOldProducts();
    
    console.log("Total number of fetched products: ", allFetchedProducts.length);
    console.timeEnd('fetchAndProcessProducts run time');
    
    return;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
}

async function processProducts(products: any[]) {
  const formattedProducts = products.map(formatProduct).filter(product => 
    product.alcohol > 0 && product.price > 0 && product.volume > 0
  );
  
  console.log(`Processing ${formattedProducts.length} valid products`);
  await addProductsToDatabase(formattedProducts);
  
  return formattedProducts;
}

function formatProduct(apiProduct: any) {
  // Extract category info
  let typeInfo = '';
  let categories = [];
  
  if (apiProduct.categoryLevel1) categories.push(apiProduct.categoryLevel1);
  if (apiProduct.categoryLevel2) categories.push(apiProduct.categoryLevel2);
  if (apiProduct.categoryLevel3) categories.push(apiProduct.categoryLevel3);
  if (apiProduct.categoryLevel4) categories.push(apiProduct.categoryLevel4);
  
  typeInfo = categories.join(', ');

  // Determine type based on categoryLevel1
  let type = '';
  if (apiProduct.categoryLevel1 === 'Öl') type = 'beer';
  else if (apiProduct.categoryLevel1 === 'Vin') type = 'wine';
  else if (apiProduct.categoryLevel1 === 'Sprit') type = 'liquor';
  else if (apiProduct.categoryLevel1 === 'Cider & blanddrycker') type = 'cider';
  else type = 'other';

  const fullType = `${type}, ${apiProduct.assortmentText || 'okänd'}`;
  
  // Format product name
  const brand = apiProduct.productNameBold || '';
  const name = apiProduct.productNameThin 
  ? `${apiProduct.productNameThin} - ${apiProduct.producerName || ''}`.trim() 
  : apiProduct.producerName || '';

  // Get image URL if available
  let imgUrl = '';
  if (apiProduct.imageModules && apiProduct.imageModules.productId) {
    imgUrl = `https://product-cdn.systembolaget.se/productimages/${apiProduct.imageModules.productId}/${apiProduct.imageModules.productId}_400.webp`;
  }
  
  // Create URL to Systembolaget
  const url = `https://systembolaget.se/${apiProduct.productNumber}`;
  
  // Calculate metrics
  const alcohol = apiProduct.alcoholPercentage || 0;
  const volume = apiProduct.volume || 0;
  const price = apiProduct.price || 0;
  
  const apk = parseFloat(((alcohol * volume) / (100 * price)).toFixed(4)) || 0;
  const vpk = parseFloat((volume / price).toFixed(4)) || 0;

  // Extract taste symbols for search
  const tasteSymbols = Array.isArray(apiProduct.tasteSymbols) 
    ? apiProduct.tasteSymbols.join(' ') 
    : '';
  
  // Create search query with taste symbols included
  const searchQueryNormalized = normalizeSearchQuery(name.toLowerCase()) + " " + 
                               normalizeSearchQuery(brand.toLowerCase()) + " " + 
                               normalizeSearchQuery(tasteSymbols.toLowerCase());
  
  const product = {
    brand: brand,
    name: name,
    systemId: parseInt(apiProduct.productId, 10) || 0,
    apk: apk,
    url: url,
    price: price,
    alcohol: alcohol,
    volume: volume,
    type: fullType + ", " + typeInfo + ", " + searchQueryNormalized,
    vpk: vpk,
    country: (apiProduct.country || '').toLowerCase(),
    lastOnSiteAt: new Date(),
    img: imgUrl,
  };
  
  allFetchedProducts.push(url);
  return product;
}

function normalizeSearchQuery(str: string): string {
  return str
    .normalize('NFD') // Normalize to decomposed form
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritical marks
    .replace(/'/g, ' '); // Replace apostrophes with spaces
}

async function addProductsToDatabase(products: any[]) {
  if (!Array.isArray(products)) {
    console.error('Error: products is not an array. Type:', typeof products);
    return;
  }
  console.log("Number of products to add to database: ", products.length);

  const totalProducts = products.length;
  const logInterval = Math.ceil(totalProducts / 10);
  const batchSize = 50; // Increased batch size for API data
  const operations: any = [];

  for (let i = 0; i < totalProducts; i++) {
    const product = products[i];

    // Validate product data
    if (!product.url) {
      console.error(`Product at index ${i} is missing a URL:`, product);
      continue;
    }

    operations.push(
      prisma.beverage.upsert({
        where: { url: product.url },
        update: product,
        create: product,
      })
    );

    if ((i + 1) % batchSize === 0 || i === totalProducts - 1) {
      try {
        await prisma.$transaction(operations);
        operations.length = 0; // Clear operations array
        console.log(`Processed ${i + 1} / ${totalProducts} products.`);
      } catch (error) {
        console.error(`Error processing batch ending at index ${i}:`, error);
      }
    }

    if ((i + 1) % logInterval === 0 || i === totalProducts - 1) {
      console.log(`Updating database progress: ${Math.ceil(((i + 1) / totalProducts) * 100)}%`);
    }
  }

  console.log('Database update complete.');
}

async function deleteOldProducts() {
  try {
    console.log('Running deleteOldProducts');
    console.log(`Number of fetched product URLs: ${allFetchedProducts.length}`);

    // First, find the IDs of products that will be deleted
    const productsToDelete = await prisma.beverage.findMany({
      where: {
        lastOnSiteAt: {
          lt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), // older than 6 days
        },
      },
      select: {
        id: true
      }
    });

    const productIds = productsToDelete.map(product => product.id);
    console.log(`Found ${productIds.length} products to delete`);

    // Delete associated rankings first
    if (productIds.length > 0) {
      const deletedRankings = await prisma.beverageRanking.deleteMany({
        where: {
          beverageId: {
            in: productIds
          }
        }
      });
      console.log(`Deleted ${deletedRankings.count} associated ranking records`);
    }

    // Then delete the products
    const deletedProducts = await prisma.beverage.deleteMany({
      where: {
        lastOnSiteAt: {
          lt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), // older than 6 days
        },
      },
    });

    console.log(`Deleted ${deletedProducts.count} old products`);
  } catch (error) {
    console.error('Error deleting old products:', error);
  }
}