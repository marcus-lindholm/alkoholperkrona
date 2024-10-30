This is an application to view Systembolagets products sorted after their APK (ml alcohol per SEK) and more.

## Author
Marcus Lindholm

## How it works
Systembolaget's own API does not allow you to retrieve the necessary information in order to achieve this which resulted in the creation of a home made API that scrapes the whole product catalogue and stores the information in a separate database. This API is generally run and updates the database once per day to make sure the information is up to date.

## Tech Stack

### Web App
* React using NextJS with Typescript
* PostgreSQL
* Prisma
* TailWindCSS

### Scraper
* Puppeteer
* Hosted on a Raspberry Pi 5 and run automatically by a cronjob


