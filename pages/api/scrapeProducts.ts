import puppeteer from "puppeteer";
import { PrismaClient } from '@prisma/client';
import { sendEmail } from './services/emailService';
import { count } from "console";
import { counter } from "@fortawesome/fontawesome-svg-core";
import { th } from "date-fns/locale";

var beerPages: number;
var liqourPages: number;
var winePages: number;
var ciderPages: number;
var allScrapedProductURLs: string[] = [];
const prisma = new PrismaClient();
const cheerio = require('cheerio');

export default async function handler(req: any, res: any) {
  console.log("scrapeProducts API called");
    if (req.method === 'GET') {
        try {
            const products = await runScraper();
            res.status(200).json({ message: 'Scraper ran successfully', products: products });
        } catch (error) {
            let errorMessage = 'An unknown error occurred';
            if (error instanceof Error) {
              errorMessage = error.message;
            }
            // Send an email notification
            await sendEmail('Scraper Failed for APKrona.se', `The scraper failed to run with the following error: ${errorMessage}`);
            res.status(500).json({ message: 'Scraper failed to run', error: error });
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}

async function runScraper(catalogue: string = 'vanligtSortiment') {
  console.time('runScraper run time');
  if (catalogue === 'ordervara') {
    var pageURL = 'https://www.systembolaget.se/sortiment/ordervaror/';
    var beerURL = 'https://www.systembolaget.se/sortiment/ol/ordervaror/?';
    var liqourURL = 'https://www.systembolaget.se/sortiment/sprit/ordervaror/?';
    var wineURL = 'https://www.systembolaget.se/sortiment/vin/ordervaror/?';
    var ciderURL = 'https://www.systembolaget.se/sortiment/cider-blanddrycker/ordervaror/?';
  } else {          
    var pageURL = 'https://www.systembolaget.se/sortiment/?sortiment=Fast+sortiment_eller_Tillf%C3%A4lligt+sortiment_eller_Lokalt+%26+Sm%C3%A5skaligt_eller_S%C3%A4song_eller_Webblanseringar';
    var beerURL = 'https://www.systembolaget.se/sortiment/ol/?sortiment=Fast+sortiment_eller_Tillf%C3%A4lligt+sortiment_eller_Lokalt+%26+Sm%C3%A5skaligt_eller_S%C3%A4song_eller_Webblanseringar&';
    var liqourURL = 'https://www.systembolaget.se/sortiment/sprit/?sortiment=Fast+sortiment_eller_Tillf%C3%A4lligt+sortiment_eller_Lokalt+%26+Sm%C3%A5skaligt_eller_S%C3%A4song_eller_Webblanseringar&';
    var wineURL = 'https://www.systembolaget.se/sortiment/vin/?sortiment=Fast+sortiment_eller_Tillf%C3%A4lligt+sortiment_eller_Lokalt+%26+Sm%C3%A5skaligt_eller_S%C3%A4song_eller_Webblanseringar&';
    var ciderURL = 'https://www.systembolaget.se/sortiment/cider-blanddrycker/?sortiment=Fast+sortiment_eller_Tillf%C3%A4lligt+sortiment_eller_Lokalt+%26+Sm%C3%A5skaligt_eller_S%C3%A4song_eller_Webblanseringar&';
  }
  
  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/chromium-browser',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    headless: true,
  });
  const page = await (await browser).newPage();

  await page.setViewport({
    width: 1300,
    height: 600
  })

  const endpoint = 'https://www.systembolaget.se/';
  await page.goto(endpoint, {
    waitUntil: 'domcontentloaded'
  });
  
  let tryCounter;
  await wait(2000);

  await clickHref(page, tryCounter = 0);
  await wait(1500);
  await acceptCookies(page, tryCounter = 0);
  await wait(1000);
  await getNumberOfPages(page, pageURL);
  await wait(1000);

  const beers = await getProductInfo(page, "beer, " + catalogue, beerPages, beerURL);
  addProductsToDatabase(beers, "beer, " + catalogue).catch(e => {
    throw e
  }).finally(async () => {
    await prisma.$disconnect()
  });
  await wait(1000);

  const liqour = await getProductInfo(page, "liquor, " + catalogue, liqourPages, liqourURL);
  addProductsToDatabase(liqour, "liqour, " + catalogue).catch(e => {
    throw e
  }).finally(async () => {
    await prisma.$disconnect()
  });
  await wait(1000);

  const wine = await getProductInfo(page, "wine, " + catalogue, winePages, wineURL);
  addProductsToDatabase(wine, "wine, " + catalogue).catch(e => {
    throw e
  }).finally(async () => {
    await prisma.$disconnect()
  });
  await wait(1000);

  const cider = await getProductInfo(page, "cider, " + catalogue, ciderPages, ciderURL);
  addProductsToDatabase(cider, "cider, " + catalogue).catch(e => {
    throw e
  }).finally(async () => {
    await prisma.$disconnect()
    console.timeEnd('runScraper run time');
  });

  await browser.close();

  if (catalogue === 'vanligtSortiment') {
    runScraper('ordervara');
  } else {
    await deleteOldProducts();
    console.log("Total number of scraped products: ", allScrapedProductURLs.length);
  }
  
  return;
}

const wait = (ms: any) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const clickHref = async (page: any, counter: number) => {
  const hrefAttribute = '/';

  if (!await page.$(`a[href="${hrefAttribute}"]`)) {
    counter++;
    if (counter < 3) {
      console.log(`cant find href, running retry nr ${counter}`);
      await wait(1000);
      await clickHref(page, counter);
    }
    throw new Error('href not found for age confirmation');
  }
  await page.click(`a[href="${hrefAttribute}"]`);
}

const acceptCookies = async (page: any, counter: number) => {
  const buttonClass = 'css-xute7l';
  console.log("running acceptCookies");

  if (!await page.$(`button.${buttonClass}`)) {
    console.log("accept button not found");
    counter++;
    if (counter < 3) {
      console.log(`cant find button, running retry nr ${counter}`);
      await wait(1000);
      await acceptCookies(page, counter);
    }
    throw new Error('accept cookies button not found');
  }
  await page.click(`button.${buttonClass}`);
}

const getNumberOfPages = async (page: any, url: string) => {
  let counter = 0;
  console.log("running getNumberOfPages");

  while (counter < 3) {
    try {
      await page.goto(url, { waitUntil: 'networkidle2' });
      console.log(`Navigated to ${url}`);
      const $ = cheerio.load(await page.content());
      const elements = $('.css-1ur18ru');

      elements.each((index: any, element: any) => {
        const category = $(element).find('.css-1nje7vx').text().trim();
        const productCount = parseInt($(element).find('.css-1bd421j').text().replace(/\s/g, ''));

        if (category === undefined || productCount === undefined || isNaN(productCount) || productCount === null) {
          throw new Error('Failed to get number of pages for each category');
        }

        switch (category) {
          case "Öl":
            beerPages = Math.ceil(productCount / 30);
            break;
          case "Vin":
            winePages = Math.ceil(productCount / 30);
            break;
          case "Sprit":
            liqourPages = Math.ceil(productCount / 30);
            break;
          case "Cider & blanddrycker":
            ciderPages = Math.ceil(productCount / 30);
            break;
          default:
            break;
        }
      });
      return;
    } catch (error) {
      console.error(`Failed to navigate, retrying ${counter + 1}`, error);
      counter++;
      wait(1000);
    }
  }
  throw new Error('Failed to get number of pages for each category');
}

const navigateCategory = async (page: any, url: string) => {
  let counter = 0;
  console.log("running navigateCategory");

  while (counter < 3) {
    try {
      await page.goto(url, { waitUntil: 'networkidle2' });
      //console.log(`Navigated to ${url}`);
      return;
    } catch (error) {
      console.error(`Failed to navigate, retrying ${counter + 1}`, error);
      counter++;
      await wait(1000);
    }
  }
  throw new Error('Failed to navigate to category');
}

function processPriceString(input: any) {
  input = input.replace(/\*/g, '');

  return input.replace(/:(.)/, (match: any, nextChar: any) => {
    if (nextChar === "-") {
      // If "-" follows ":", remove ":" and all characters after it
      return '';
    } else {
      // If any other character follows ":", replace ":" with ","
      return '.' + nextChar;
    }
  });
}

function processAlcString(input: any) {
  const startIndex = input.indexOf(" ml") + 3;
  const endIndex = input.indexOf("%");
  // Check if both " ml" and "%" are found in the string
  if (startIndex > -1 && endIndex > -1 && endIndex > startIndex) {
    // Extract and return the substring between " ml" and "%"
    return input.substring(startIndex, endIndex).replace(',', '.').trim();
  }
  return "";
}

function processVolumeString(input: any) {
  // Remove all characters before the first number
  const firstNumberIndex = input.search(/\d/);
  const cleanedInput = input.substring(firstNumberIndex);

  // Check for multi-pack patterns
  const multiPackPattern = /(\d+)\s*(flaskor|burkar|bottles|cans)\s*[àa]\s*(\d+)\s*ml/gi;
  let totalVolume = 0;
  let match;

  // Create a set to track indices of multi-pack matches to avoid double counting
  const multiPackIndices = new Set<number>();

  while ((match = multiPackPattern.exec(cleanedInput)) !== null) {
    const numberOfPacks = parseInt(match[1], 10);
    const volumePerPack = parseInt(match[3], 10);
    totalVolume += numberOfPacks * volumePerPack;
    // Mark the range of the match to avoid double counting
    for (let i = match.index; i < match.index + match[0].length; i++) {
      multiPackIndices.add(i);
    }
  }

  // Check for single pack patterns within the same string
  const singlePackPattern = /(\d+)\s*ml/gi;
  while ((match = singlePackPattern.exec(cleanedInput)) !== null) {
    // Only add the volume if it is not part of a multi-pack match
    let isPartOfMultiPack = false;
    for (let i = match.index; i < match.index + match[0].length; i++) {
      if (multiPackIndices.has(i)) {
        isPartOfMultiPack = true;
        break;
      }
    }
    if (!isPartOfMultiPack) {
      const volume = parseInt(match[1], 10);
      totalVolume += volume;
    }
  }

  if (totalVolume > 0) {
    return `${totalVolume}`;
  }

  return cleanedInput.replace(' ', '');
}

async function waitForSelectorIndefinitely(page: any, selector: string) {
  while (true) {
    try {
      await page.waitForSelector(selector, { timeout: 10000 });
      break;
    } catch (error) {
      await wait(2000);
    }
  }
}

const getProductInfo = async (page: any, type: string, pages: number, url: string) => {
  console.log("running getProductInfo");
  const products: { brand: string; name: any; apk: number; url: string; price: number; alcohol: number; volume: number; type: string }[] = [];
  let currentPage = 1;
  console.log("Number of pages: ", pages);
  while (currentPage <= pages) {
    try {
      await navigateCategory(page, url + "p=" + currentPage);
      await wait(1000);
      await waitForSelectorIndefinitely(page, 'div.css-1fgrh1r a');
      const $ = cheerio.load(await page.content());
      let countConsecutiveZeros = 0;
      console.log(`Currently on ${type} page ${currentPage} out of ${pages}`);

      const aTags = $('div.css-1fgrh1r a');
      aTags.each((index: any, element: any) => {
        const priceString = $(element).find('.css-2114pf .css-1n1rld4 .css-k008qs .css-1x8f7yz .css-gg4vpm .css-k008qs p.css-a2frwy').text();
        const price = parseFloat(processPriceString(priceString).replace(/[^0-9.]/g, ''));
        const volumeAndAlcohol = $(element).find('.css-2114pf .css-1n1rld4 .css-k008qs .css-1x8f7yz .css-gg4vpm .css-1dtnjt5 p.css-rp7p3f').text();
        const alcohol = parseFloat(processAlcString(volumeAndAlcohol));
        const brand = $(element).find('.css-2114pf .css-1n1rld4 .css-k008qs .css-1x8f7yz .css-j7qwjs .css-rqa69l .css-1njx6qf').text();
        const name = $(element).find('.css-2114pf .css-1n1rld4 .css-k008qs .css-1x8f7yz .css-j7qwjs .css-rqa69l .css-4oiqd').text();
        const typeInfo = $(element).find('.css-2114pf .css-1n1rld4 .css-k008qs .css-1x8f7yz .css-j7qwjs .css-4oiqd8').text();
        if (alcohol === 0 || alcohol == null || isNaN(alcohol)) {
          console.log("Alcohol is 0 or undefined, skipping product " + brand + " " + name);
          countConsecutiveZeros++;
          if (countConsecutiveZeros > 29) {
            throw new Error('30 consecutive products with alcohol 0 or undefined, scraper propably not working');
          }
          return;
        }
        const volume = parseInt(processVolumeString(volumeAndAlcohol));
        const apk = parseFloat(((alcohol * volume) / (100*price)).toFixed(4));

        const product = {
          brand: brand,
          name: name,
          apk: apk,
          url: "https://systembolaget.se" + $(element).attr('href'),
          price: price,
          alcohol: alcohol,
          volume: volume,
          type: type + ", " + typeInfo,
        }
        products.push(product);
        allScrapedProductURLs.push(product.url);
        //console.log(product);
      });

      currentPage++;
    } catch (error) {
      throw new Error(`Failed to scrape page ${currentPage}: ${error}`);
    }
  }
  return products;
}

async function addProductsToDatabase(products: any, type: string) {
  if (!Array.isArray(products)) {
    console.log(products);
    console.error('Error: products is not an array. Type:', typeof products);
    return;
  }
  console.log("Number of products: ", products.length);

  const totalProducts = products.length;
  const logInterval = Math.ceil(totalProducts / 10);
  const operations: any = [];
  
  for (let i = 0; i < totalProducts; i++) {
    const product = products[i];
    operations.push(
      prisma.beverage.upsert({
        where: { url: product.url },
        update: product,
        create: product,
      })
    );
  
    if ((i + 1) % logInterval === 0 || i === totalProducts - 1) {
      console.log(`Updating database progress: ${Math.ceil(((i + 1) / totalProducts) * 100)}%`);
    }
  }
  
  await prisma.$transaction(async (prisma) => {
    const totalOperations = operations.length;
    for (let i = 0; i < totalOperations; i++) {
      await operations[i];
      if ((i + 1) % logInterval === 0 || i === totalOperations - 1) {
        const timestamp = new Date().toISOString();
        console.log(`[${timestamp}] ${type} transaction progress: ${Math.ceil(((i + 1) / totalOperations) * 100)}%`);
      }
    }
  }, {
    timeout: 6000000,
  });

  console.log(type + ': Database update complete.');

}

async function deleteOldProducts() {
  try {
    console.log('Running deleteOldProducts');
    console.log(`Number of scraped product URLs: ${allScrapedProductURLs.length}`);

/*     // Fetch all product URLs from the database
    const allDatabaseProducts = await prisma.beverage.findMany({
      select: {
        url: true,
      },
    });
    const allDatabaseProductURLs = allDatabaseProducts.map(product => product.url);

    // Log the number of products in the database
    console.log(`Number of products in the database: ${allDatabaseProducts.length}`);

    const setOfScrapedProductURLs = new Set(allScrapedProductURLs);
    const urlsNotInScraped = allDatabaseProductURLs.filter(url => !setOfScrapedProductURLs.has(url));

    // Log the URLs that are in the database but not in allScrapedProductURLs
    console.log('URLs in the database but not in scraped URLs:', urlsNotInScraped);
    // Log the count of URLs not in scraped URLs
    console.log(`Number of URLs in the database but not in scraped URLs: ${urlsNotInScraped.length}`); */

    // Perform the deletion
    await prisma.beverage.deleteMany({
      where: {
        updatedAt: {
          lt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // older than 15 days
        },
      },
    });

    console.log('Deleted old products');
  } catch (error) {
    console.error('Error deleting old products:', error);
  }
}
