const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

const generateSiteMap = () => {
  const currentDate = new Date().toISOString().split('T')[0];
  
  return `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" 
          xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
          xmlns:xhtml="http://www.w3.org/1999/xhtml"
          xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
          xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
    <url>
      <loc>https://www.apkrona.se/</loc>
      <lastmod>${currentDate}</lastmod>
      <changefreq>daily</changefreq>
      <priority>1.0</priority>
    </url>
    <url>
      <loc>https://www.apkrona.se/explore</loc>
      <lastmod>${currentDate}</lastmod>
      <changefreq>daily</changefreq>
      <priority>0.8</priority>
    </url>
    <url>
      <loc>https://www.apkrona.se/settings</loc>
      <lastmod>${currentDate}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>0.5</priority>
    </url>
    <url>
      <loc>https://www.apkrona.se/ai</loc>
      <lastmod>${currentDate}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>0.7</priority>
    </url>
    <url>
      <loc>https://www.apkrona.se/ai/party-planner</loc>
      <lastmod>${currentDate}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>0.7</priority>
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