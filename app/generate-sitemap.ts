const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

const generateSiteMap = () => {
  return `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
      <loc>https://www.apkrona.se/</loc>
      <priority>1.0</priority>
    </url>
    <url>
      <loc>https://www.apkrona.se/explore</loc>
      <priority>0.8</priority>
    </url>
    <url>
      <loc>https://www.apkrona.se/settings</loc>
      <priority>0.8</priority>
    </url>
  </urlset>
  `;
};

async function generateSitemap() {
  const sitemap = generateSiteMap();
  const sitemapPath = path.join(__dirname, '..', 'public', 'sitemap.xml');

  fs.writeFileSync(sitemapPath, sitemap);
  console.log(`Sitemap written to ${sitemapPath}`);
}

generateSitemap().catch((e) => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});