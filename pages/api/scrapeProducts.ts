import puppeteer from "puppeteer";
import { PrismaClient } from '@prisma/client';

var beerPages: number;
var liqourPages: number;
var winePages: number;
var ciderPages: number;
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
    var beerURL = 'https://www.systembolaget.se/sortiment/ol/ordervaror/?p=';
    var liqourURL = 'https://www.systembolaget.se/sortiment/sprit/ordervaror/?p=';
    var wineURL = 'https://www.systembolaget.se/sortiment/vin/ordervaror/?p=';
    var ciderURL = 'https://www.systembolaget.se/sortiment/cider-blanddrycker/ordervaror/?p=';
  } else {
    var pageURL = 'https://www.systembolaget.se/sortiment/';
    var beerURL = 'https://www.systembolaget.se/sortiment/ol/?sortiment=Fast%20sortiment_eller_Tillfälligt%20sortiment_eller_Lokalt%20%26%20Småskaligt_eller_Säsong_eller_Webblanseringar/&p=';
    var liqourURL = 'https://www.systembolaget.se/sortiment/sprit/?sortiment=Fast%20sortiment_eller_Tillfälligt%20sortiment_eller_Lokalt%20%26%20Småskaligt_eller_Säsong_eller_Webblanseringar/&p=';
    var wineURL = 'https://www.systembolaget.se/sortiment/vin/?sortiment=Fast%20sortiment_eller_Tillfälligt%20sortiment_eller_Lokalt%20%26%20Småskaligt_eller_Säsong_eller_Webblanseringar/&p=';
    var ciderURL = 'https://www.systembolaget.se/sortiment/cider-blanddrycker/?sortiment=Fast%20sortiment_eller_Tillfälligt%20sortiment_eller_Lokalt%20%26%20Småskaligt_eller_Säsong_eller_Webblanseringar/&p=';
  }
  /* const browser = puppeteer.launch(
    {
      headless: false,
      
    }) */
  
  const browser = await puppeteer.launch({
    //executablePath: '/usr/bin/chromium-browser',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    headless: false,
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

  await navigateBeer(page, beerURL);
  await wait(2000);
  const beers = await getProductInfo(page, "beer, " + catalogue);
  addProductsToDatabase(beers, "beer, " + catalogue).catch(e => {
    throw e
  }).finally(async () => {
    await prisma.$disconnect()
  });
  await wait(1000);

  await navigateLiqour(page, liqourURL);
  await wait(2000);
  const liqour = await getProductInfo(page, "liquor, " + catalogue);
  addProductsToDatabase(liqour, "liqour, " + catalogue).catch(e => {
    throw e
  }).finally(async () => {
    await prisma.$disconnect()
  });
  await wait(1000);

  await navigateWine(page, wineURL);
  await wait(2000);
  const wine = await getProductInfo(page, "wine, " + catalogue);
  addProductsToDatabase(wine, "wine, " + catalogue).catch(e => {
    throw e
  }).finally(async () => {
    await prisma.$disconnect()
  });
  await wait(1000);

  await navigateCider(page, ciderURL);
  await wait(2000);
  const cider = await getProductInfo(page, "cider, " + catalogue);
  addProductsToDatabase(cider, "cider, " + catalogue).catch(e => {
    throw e
  }).finally(async () => {
    await prisma.$disconnect()
    console.timeEnd('runScraper run time');
  });

  await browser.close();

  if (catalogue === 'vanligtSortiment') {
    runScraper('ordervara');
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
  const buttonClass = 'css-hjlgj3';
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
  //const url = 'https://www.systembolaget.se/sortiment/?sortiment=Fast%20sortiment_eller_Tillfälligt%20sortiment_eller_Lokalt%20%26%20Småskaligt_eller_Webblanseringar_eller_Säsong';
  //const url = 'https://www.systembolaget.se/sortiment/ordervaror/';
  console.log("running getNumberOfPages");
  const $ = cheerio.load(await page.content());

  while (counter < 3) {
    try {
      await page.goto(url, { waitUntil: 'networkidle2' });
      console.log(`Navigated to ${url}`);
      const $ = cheerio.load(await page.content());
      const elements = $('.css-bxnnm4');

      elements.each((index: any, element: any) => {
        if($(element).find('.css-ziux8h').text() === "Öl") {
          const beerProducts = parseInt($(element).find('.css-1g5cy76').text().replace(/\s/g, ''));
          beerPages = Math.ceil(beerProducts / 30);
        } else if($(element).find('.css-ziux8h').text() === "Vin") {
          const wineProducts = parseInt($(element).find('.css-1g5cy76').text().replace(/\s/g, ''));
          winePages = Math.ceil(wineProducts / 30);
        } else if($(element).find('.css-ziux8h').text() === "Sprit") {
          const liqourProducts = parseInt($(element).find('.css-1g5cy76').text().replace(/\s/g, ''));
          liqourPages = Math.ceil(liqourProducts / 30);
        } else if($(element).find('.css-ziux8h').text() === "Cider & blanddrycker") {
          const ciderProducts = parseInt($(element).find('.css-1g5cy76').text().replace(/\s/g, ''));
          ciderPages = Math.ceil(ciderProducts / 30);
        } else {
          return;
        }
      });
      
      return;
    } catch (error) {
      console.error(`Failed to navigate, retrying ${counter + 1}`, error);
      counter++;
      await wait(1000);
    }
  }
}

const navigateBeer = async (page: any, beerURL: string) => {
  let counter = 0;
  const url = beerURL + beerPages;
  //const url = 'https://www.systembolaget.se/sortiment/ol/?sortiment=Fast%20sortiment_eller_Tillfälligt%20sortiment_eller_Lokalt%20%26%20Småskaligt_eller_Säsong_eller_Webblanseringar/&p=' + beerPages;
  //const url = 'https://www.systembolaget.se/sortiment/ol/ordervaror/?p=' + beerPages;
  console.log("running navigateBeer");

  while (counter < 3) {
    try {
      await page.goto(url, { waitUntil: 'networkidle2' });
      console.log(`Navigated to ${url}`);
      return;
    } catch (error) {
      console.error(`Failed to navigate, retrying ${counter + 1}`, error);
      counter++;
      await wait(1000);
    }
  }
}

const navigateLiqour = async (page: any, liqourURL: string) => {
  let counter = 0;
  const url = liqourURL + liqourPages;
  //const url = 'https://www.systembolaget.se/sortiment/sprit/?sortiment=Fast%20sortiment_eller_Tillfälligt%20sortiment_eller_Lokalt%20%26%20Småskaligt_eller_Säsong_eller_Webblanseringar/&p=' + liqourPages;
  //const url = 'https://www.systembolaget.se/sortiment/sprit/ordervaror/?p=' + liqourPages;
  console.log("running navigateLiqour");

  while (counter < 3) {
    try {
      await page.goto(url, { waitUntil: 'networkidle2' });
      console.log(`Navigated to ${url}`);
      return;
    } catch (error) {
      console.error(`Failed to navigate, retrying ${counter + 1}`, error);
      counter++;
      await new Promise(resolve => setTimeout(resolve, 1000)); // Use setTimeout for delay
    }
  }
}

const navigateWine = async (page: any, wineURL: string) => {
  let counter = 0;
  const url = wineURL + winePages;
  //const url = 'https://www.systembolaget.se/sortiment/vin/?sortiment=Fast%20sortiment_eller_Tillfälligt%20sortiment_eller_Lokalt%20%26%20Småskaligt_eller_Säsong_eller_Webblanseringar/&p=' + winePages;
  //const url = 'https://www.systembolaget.se/sortiment/vin/ordervaror/?p=' + winePages;

  console.log("running navigateWine");

  while (counter < 3) {
    try {
      await page.goto(url, { waitUntil: 'networkidle2' });
      console.log(`Navigated to ${url}`);
      return;
    } catch (error) {
      console.error(`Failed to navigate, retrying ${counter + 1}`, error);
      counter++;
      await new Promise(resolve => setTimeout(resolve, 1000)); // Use setTimeout for delay
    }
  }
}

const navigateCider = async (page: any, ciderURL: string) => {
  let counter = 0;
  const url = ciderURL + ciderPages;
  //const url = 'https://www.systembolaget.se/sortiment/cider-blanddrycker/?sortiment=Fast%20sortiment_eller_Tillfälligt%20sortiment_eller_Lokalt%20%26%20Småskaligt_eller_Säsong_eller_Webblanseringar/&p=' + ciderPages;
  //const url = 'https://www.systembolaget.se/sortiment/cider-blanddrycker/ordervaror/?p=' + ciderPages;
  console.log("running navigateCider");

  while (counter < 3) {
    try {
      await page.goto(url, { waitUntil: 'networkidle2' });
      console.log(`Navigated to ${url}`);
      return;
    } catch (error) {
      console.error(`Failed to navigate, retrying ${counter + 1}`, error);
      counter++;
      await new Promise(resolve => setTimeout(resolve, 1000)); // Use setTimeout for delay
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

const getProductInfo = async (page: any, type: string) => {
  console.log("running getProductInfo"); 
  await page.waitForSelector('div.css-176nwz9 a', { timeout: 0 });

  const $ = cheerio.load(await page.content());
  const products: { brand: string; name: any; apk: number; url: string; price: number; alcohol: number; volume: number; type: string }[] = [];

    const aTags = $('div.css-176nwz9 a');
    aTags.each((index: any, element: any) => {
      const priceString = $(element).find('.css-1spqwqt .css-1mrpgcx .css-8zpafe .css-6df2t1 .css-vgnpl .css-8zpafe p.css-17znts1').text();
      const price = parseFloat(processPriceString(priceString).replace(/[^0-9.]/g, ''));
      const volumeAndAlcohol = $(element).find('.css-1spqwqt .css-1mrpgcx .css-8zpafe .css-6df2t1 .css-vgnpl .css-5aqtg5 p.css-bbhn7t').text();
      const alcohol = parseFloat(processAlcString(volumeAndAlcohol));
      const brand = $(element).find('.css-1spqwqt .css-1mrpgcx .css-8zpafe .css-6df2t1 .css-uxm6qc .css-18q0zs4 .css-1n0krvs').text();
      const name = $(element).find('.css-1spqwqt .css-1mrpgcx .css-8zpafe .css-6df2t1 .css-uxm6qc .css-18q0zs4 .css-123rcq0').text();
      const typeInfo = $(element).find('.css-1spqwqt .css-1mrpgcx .css-8zpafe .css-6df2t1 .css-uxm6qc .css-i37je3').text();
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
      //console.log(product);
    })
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