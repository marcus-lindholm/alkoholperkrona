import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Head from "next/head";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "APKrona.se - Högst APK Systembolaget",
  description: "APK-listan som visar vilka produkter som har högst mängd alkohol per krona hos Systembolaget.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta property="og:image" content="/favicon.ico" />
        <meta property="og:url" content="https://www.apkrona.se" />
        <script 
          async 
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8117821348663742"
          crossOrigin="anonymous">
        </script>
      </Head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
