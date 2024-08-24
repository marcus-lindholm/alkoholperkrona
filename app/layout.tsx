import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Head from "next/head";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "APKrona.se",
  description: "APK-listan som visar vilka produkter som har högst mängd alkohol per krona.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Head>
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
