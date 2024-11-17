import puppeteer from "puppeteer";
import { PrismaClient } from '@prisma/client';

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
    var pageURL = 'https://www.systembolaget.se/sortiment/?sortiment=Fast%20sortiment_eller_Tillf%C3%A4lligt%20sortiment_eller_Lokalt%20%26%20Sm%C3%A5skaligt_eller_S%C3%A4song_eller_Webblanseringar';
    var beerURL = 'https://www.systembolaget.se/sortiment/ol/?sortiment=Fast%20sortiment_eller_Tillf%C3%A4lligt%20sortiment_eller_Lokalt%20%26%20Sm%C3%A5skaligt_eller_S%C3%A4song&';
    var liqourURL = 'https://www.systembolaget.se/sortiment/sprit/?sortiment=Fast%20sortiment_eller_Tillf%C3%A4lligt%20sortiment_eller_Lokalt%20%26%20Sm%C3%A5skaligt_eller_Webblanseringar_eller_S%C3%A4song&';
    var wineURL = 'https://www.systembolaget.se/sortiment/vin/?sortiment=Fast%20sortiment_eller_Tillf%C3%A4lligt%20sortiment_eller_Lokalt%20%26%20Sm%C3%A5skaligt_eller_Webblanseringar_eller_S%C3%A4song&';
    var ciderURL = 'https://www.systembolaget.se/sortiment/cider-blanddrycker/?sortiment=Fast%20sortiment_eller_Tillf%C3%A4lligt%20sortiment_eller_Lokalt%20%26%20Sm%C3%A5skaligt_eller_Webblanseringar_eller_S%C3%A4song&';
  }
  /* const browser = puppeteer.launch(
    {
      headless: false,
      
    }) */
  
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
  
  await wait(2000);

  await clickHref(page);
  await wait(1500);
  await acceptCookies(page);
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

const clickHref = async (page: any) => {
  let counter = 0;
  const hrefAttribute = '/';

  if (!await page.$(`a[href="${hrefAttribute}"]`)) {
    counter++;
    if (counter < 3) {
      console.log(`cant find href, running retry ${counter}`);
      await wait(1000);
      await clickHref(page);
    } else {
      console.log('href not found');
    }
    return;
  }
  await page.click(`a[href="${hrefAttribute}"]`);
}

const acceptCookies = async (page: any) => {
  let counter = 0;
  const buttonClass = 'css-60ae9g';
  console.log("running acceptCookies");

  if (!await page.$(`button.${buttonClass}`)) {
    console.log("accept button not found");
    counter++;
    if (counter < 3) {
      console.log(`cant find button, running retry ${counter}`);
      await wait(1000);
      await acceptCookies(page);
    } else {
      console.log('href not found');
    }
    return;
  }
  await page.click(`button.${buttonClass}`);
  counter = 3;
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
        const category = $(element).find('.css-fer26v').text().trim();
        const productCount = parseInt($(element).find('.css-w2p565').text().replace(/\s/g, ''));

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

  // Remove everything after " ml" including " ml"
  const mlIndex = cleanedInput.indexOf(" ml");
  if (mlIndex !== -1) {
      return cleanedInput.substring(0, mlIndex).replace(' ', '');
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
      console.log(`Currently on ${type} page ${currentPage} out of ${pages}`);

      const aTags = $('div.css-1fgrh1r a');
      aTags.each((index: any, element: any) => {
        const priceString = $(element).find('.css-2114pf .css-1n1rld4 .css-k008qs .css-1x8f7yz .css-gg4vpm .css-k008qs p.css-1k0oafj').text();
        const price = parseFloat(processPriceString(priceString).replace(/[^0-9.]/g, ''));
        const volumeAndAlcohol = $(element).find('.css-2114pf .css-1n1rld4 .css-k008qs .css-1x8f7yz .css-gg4vpm .css-1dtnjt5 p.css-e42h23').text();
        const alcohol = parseFloat(processAlcString(volumeAndAlcohol));
        const brand = $(element).find('.css-2114pf .css-1n1rld4 .css-k008qs .css-1x8f7yz .css-j7qwjs .css-rqa69l .css-1i86311').text();
        const name = $(element).find('.css-2114pf .css-1n1rld4 .css-k008qs .css-1x8f7yz .css-j7qwjs .css-rqa69l .css-i3atuq').text();
        const typeInfo = $(element).find('.css-2114pf .css-1n1rld4 .css-k008qs .css-1x8f7yz .css-j7qwjs .css-apwxtg').text();
        if (alcohol === 0 || alcohol == null || isNaN(alcohol)) {
          console.log("Alcohol is 0 or undefined, skipping product " + brand + " " + name);
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
      console.error(`Failed to scrape page ${currentPage}`, error);
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
        console.log(type + ` transaction progress: ${Math.ceil(((i + 1) / totalOperations) * 100)}%`);
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
          lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // older than 30 days
        },
      },
    });

    console.log('Deleted old products');
  } catch (error) {
    console.error('Error deleting old products:', error);
  }
}
