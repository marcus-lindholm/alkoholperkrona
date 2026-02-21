import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Head from "next/head";
import Script from "next/script";
import seoKeywords from './seo';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL('https://www.apkrona.se'),
  title: {
    default: "APKrona.se - Bästa APK på Systembolaget | Jämför Alkohol per Krona",
    template: "%s | APKrona.se"
  },
  description: "⭐ Sveriges bästa APK-jämförare! Hitta mest alkohol per krona på Systembolaget. Uppdateras dagligen med de mest prisvärda dryckerna. Jämför över 10 000+ produkter - spara pengar på sprit, vin och öl.",
  keywords: seoKeywords,
  authors: [{ name: "APKrona.se" }],
  creator: "APKrona.se",
  publisher: "APKrona.se",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'sv_SE',
    url: 'https://www.apkrona.se',
    siteName: 'APKrona.se',
    title: 'APKrona.se - Bästa APK på Systembolaget | Jämför Alkohol per Krona',
    description: '⭐ Sveriges bästa APK-jämförare! Hitta mest alkohol per krona på Systembolaget. Uppdateras dagligen med de mest prisvärda dryckerna.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'APKrona.se - Jämför APK på Systembolaget',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'APKrona.se - Bästa APK på Systembolaget',
    description: '⭐ Sveriges bästa APK-jämförare! Hitta mest alkohol per krona på Systembolaget.',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: 'https://www.apkrona.se',
  },
  verification: {
    google: 'google-site-verification-code-here', // Replace with your actual Google Search Console verification code
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    return (
    <html lang="sv">
      <Head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </Head>
      <body className={inter.className}>
        {children}
        <Script id="clarity-script" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "${process.env.NEXT_PUBLIC_CLARITY_ID}");
          `}
        </Script>
        {/* JSON-LD Structured Data */}
        <Script id="json-ld" type="application/ld+json" strategy="beforeInteractive">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "APKrona.se",
            "url": "https://www.apkrona.se",
            "description": "Sveriges bästa APK-jämförare för Systembolaget. Hitta mest alkohol per krona.",
            "potentialAction": {
              "@type": "SearchAction",
              "target": {
                "@type": "EntryPoint",
                "urlTemplate": "https://www.apkrona.se?searchQuery={search_term_string}"
              },
              "query-input": "required name=search_term_string"
            }
          })}
        </Script>
        <Script id="organization-ld" type="application/ld+json" strategy="beforeInteractive">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "APKrona.se",
            "url": "https://www.apkrona.se",
            "logo": "https://www.apkrona.se/favicon.ico",
            "sameAs": []
          })}
        </Script>
      </body>
    </html>
  );
}
