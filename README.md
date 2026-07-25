This is an application to view Systembolaget's products sorted by their APK (ml alcohol per SEK) and more. It is live at [apkrona.se](https://www.apkrona.se).

## Author
Marcus Lindholm

## How it works
Systembolaget's own API does not expose the information needed to calculate and compare products by APK, so the app maintains its own database instead.

Rather than scraping the website, the app now pulls the full product catalogue from a community-maintained JSON API ([susbolaget.emrik.org](https://susbolaget.emrik.org/v1/products)). For every product it computes the metrics the site is built around — **APK** (`alcohol × volume / (100 × price)`) and **VPK** (volume per krona) — normalizes the category, name and taste data into a searchable field, and upserts everything into a PostgreSQL database via Prisma. Products that haven't appeared in the source for more than six days are pruned.

This update runs once per day. A separate step also records a daily **ranking snapshot** for each product, so the site can show how a product's APK and rank have moved over time.

The website reads from this database through Next.js API routes, which handle pagination, filtering (by type/subtype, order-only items, gluten-free, search), sorting, and random product picks.

## Features
* Browse and sort Systembolaget's catalogue by APK, VPK, price and more
* Filtering by category, subtype, gluten-free, and free-text search
* Per-product ranking history charts
* AI-powered party planner and food-pairing suggestions (Google Gemini)
* Native iOS and Android apps that wrap the live site

## Tech Stack

### Web App
* React 19 with Next.js (App + Pages Router) and TypeScript
* PostgreSQL (Vercel Postgres) with Prisma
* TailwindCSS + NextUI
* Recharts for ranking history
* Nodemailer for failure notifications
* Google Gemini for the AI features
* Hosted on Vercel

### Data pipeline
* Fetches the catalogue from the susbolaget JSON API (via `axios`)
* `/api/scrapeProducts` — fetches, formats and upserts products, then prunes stale ones
* `/api/updateRankings` — writes the daily APK ranking snapshots
* Runs on a schedule (cron); these update routes are disabled in production

### Mobile
* Capacitor — the iOS and Android apps load the live website inside a WebView
