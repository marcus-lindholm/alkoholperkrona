import puppeteer from "puppeteer";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

//const pupperteer = require('puppeteer');
const cheerio = require('cheerio');

export default async function handler(req: any, res: any) {
  console.log("scrapeProducts API called");
    if (req.method === 'GET') {
        try {
            const products = await runScraper();
            res.status(200).json({ message: 'Scraper ran successfully', products: products });
        } catch (error) {
            res.status(500).json({ message: 'Scraper failed to run' });
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}

async function runScraper() {
  /* const browser = puppeteer.launch(
    {
      headless: false,
      
    }) */
  
  const browser = await puppeteer.launch({
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
  await clickSortiment(page);
  await wait(1000);
  const products = await getProductInfo(page);

  addProductsToDatabase(products).catch(e => {
    throw e
  }).finally(async () => {
    await prisma.$disconnect()
  });

  return products;

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
    console.log("button not found");
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
}

const clickSortiment = async (page: any) => {
  let counter = 0;
  const attribute = '/sortiment/';
  console.log("running clickSortiment");

  if (!await page.$(`a[href="${attribute}"]`)) {
    console.log("a not found");
    counter++;
    if (counter < 3) {
      console.log(`cant find a, running retry ${counter}`);
      await wait(1000);
      await acceptCookies(page);
    } else {
      console.log('href not found');
    }
    return;
  }
  await page.click(`a[href="${attribute}"]`);
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
// Return an empty string if the conditions are not met
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

const getProductInfo = async (page: any) => {
  let counter = 0;
  const $ = cheerio.load(await page.content());
  const products: { name: any; url: string; price: number; alcohol: number; volume: number; }[] = [];
  console.log("running getProductInfo");

  if(!await page.$('div.css-176nwz9 a')) {
    counter++;
    console.log("a not found. retrying number: " + counter);
    if(counter < 3) {
      await wait(1000);
      await getProductInfo(page);
    } else {
      console.log("a not found");
    }
    return;
  }

  const aTags = $('div.css-176nwz9 a');
  aTags.each((index: any, element: any) => {
    const priceString = $(element).find('.css-1spqwqt .css-1mrpgcx .css-8zpafe .css-6df2t1 .css-vgnpl .css-8zpafe p.css-17znts1').text();
    const volumeAndAlcohol = $(element).find('.css-1spqwqt .css-1mrpgcx .css-8zpafe .css-6df2t1 .css-vgnpl .css-5aqtg5 p.css-bbhn7t').text();

    const product = {
      brand: $(element).find('.css-1spqwqt .css-1mrpgcx .css-8zpafe .css-6df2t1 .css-uxm6qc .css-18q0zs4 .css-1n0krvs').text(),
      name: $(element).find('.css-1spqwqt .css-1mrpgcx .css-8zpafe .css-6df2t1 .css-uxm6qc .css-18q0zs4 .css-123rcq0').text(),
      url: "https://systembolaget.se" + $(element).attr('href'),
      price: parseFloat(processPriceString(priceString).replace(/[^0-9.]/g, '')),
      alcohol: parseFloat(processAlcString(volumeAndAlcohol)),
      volume: parseInt(processVolumeString(volumeAndAlcohol)),
    }
    products.push(product);
    //console.log(product);
  })
  return products;
}

async function addProductsToDatabase(products: any) {
  for (let product of products) {
    await prisma.beverage.upsert({
      where: { url: product.url },
      update: product,
      create: product,
    });
  }
}

export async function fetchProducts() {
  return await prisma.beverage.findMany();
}