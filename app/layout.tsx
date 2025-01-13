import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Head from "next/head";
import Script from "next/script";
import seoKeywords from './seo';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "APKrona.se - Jämför APK på Systembolagets sortiment",
  description: "APK-listan som visar vilka produkter som har högst mängd alkohol per krona hos Systembolaget. Bläddra och sortera för att hitta de mest prisvärda dryckerna. Uppdateras dagligen!",
  keywords: seoKeywords,
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
      <body className={inter.className}>
        {children}
        <Script id="clarity-script" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "${process.env.CLARITY_ID}");
          `}
        </Script>
      </body>
    </html>
  );
}
