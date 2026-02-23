import React from 'react';
import Link from 'next/link';
import Script from 'next/script';

interface SeoContentProps {
  isDarkMode: boolean;
  onCategoryClick?: (filterType: string, nestedFilter: string) => void;
}

export default function SeoContent({ isDarkMode, onCategoryClick }: SeoContentProps) {
  const categoryMap: { [key: string]: { filterType: string; nestedFilter: string } } = {
    'Vodka': { filterType: 'liquor', nestedFilter: 'vodka' },
    'Whisky': { filterType: 'liquor', nestedFilter: 'whiskey' },
    'Vin': { filterType: 'wine', nestedFilter: '' },
    'Öl': { filterType: 'beer', nestedFilter: '' },
    'Rom': { filterType: 'liquor', nestedFilter: 'rom' },
    'Gin': { filterType: 'liquor', nestedFilter: ' gin' },
    'Cider': { filterType: 'cider', nestedFilter: '' },
    'Likör': { filterType: 'liquor', nestedFilter: 'likör' }
  };

  const handleCategoryClick = (category: string) => {
    if (onCategoryClick) {
      const filter = categoryMap[category];
      onCategoryClick(filter.filterType, filter.nestedFilter);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const faqs = [
    {
      question: 'Vad betyder APK?',
      answer: 'APK står för Alkohol Per Krona och mäter hur många milliliter ren alkohol (etanol) du får per spenderad krona. Ju högre APK-värde, desto mer alkohol får du för pengarna. Formeln är: (volym i ml × alkoholhalt i procent) ÷ pris i kronor.'
    },
    {
      question: 'Hur ofta uppdateras APKrona.se?',
      answer: 'APKrona.se uppdateras dagligen med de senaste priserna och produkterna från Systembolagets sortiment. Vi hämtar data med hjälp av C4illins öppna API för att säkerställa att informationen alltid är aktuell.',
      richAnswer: <>APKrona.se uppdateras dagligen med de senaste priserna och produkterna från Systembolagets sortiment. Vi hämtar data med hjälp av <a href="https://github.com/alkolist/alkolist.github.io" target="_blank" rel="noopener noreferrer" className="underline hover:text-sky-500">C4illins öppna API</a> för att säkerställa att informationen alltid är aktuell.</>,
    },
    {
      question: 'Hur hittar jag billigaste alkoholen på Systembolaget?',
      answer: 'Använd APKronas jämförare för att sortera efter APK (alkohol per krona). Produkterna med högst APK ger dig mest alkohol för pengarna. Du kan filtrera på kategori som öl, vin, sprit eller cider för att hitta det bästa köpet i varje kategori.'
    },
    {
      question: 'Vilken sprit har bäst APK på Systembolaget?',
      answer: 'APK-rankingen ändras dagligen baserat på Systembolagets priser och sortiment. Använd vår realtidslista för att alltid se vilka produkter som just nu har högst APK. Generellt har starksprit som vodka och rom ofta höga APK-värden.'
    },
    {
      question: 'Kan jag filtrera på glutenfria produkter?',
      answer: 'Ja! APKrona.se har en inställning för att visa enbart glutenfria produkter. Aktivera det i inställningarna så filtreras gluteninnehållande produkter som vanligt öl bort automatiskt.'
    },
  ];

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': faqs.map(faq => ({
      '@type': 'Question',
      'name': faq.question,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': faq.answer,
      },
    })),
  };

  return (
    <section className={`w-full max-w-6xl mx-auto mt-16 mb-8 px-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
      <Script id="faq-schema" type="application/ld+json" strategy="beforeInteractive">
        {JSON.stringify(faqSchema)}
      </Script>

      <article className="space-y-10">
        {/* Hero / intro */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-4">
            APKrona.se &ndash; Hitta bäst APK på Systembolaget {new Date().getFullYear()}
          </h1>
          <p className="text-lg leading-relaxed max-w-3xl">
            Jämför <strong>alkohol per krona</strong> på över 20&nbsp;000 produkter från Systembolaget. 
            Vår APK-ranking uppdateras dagligen så att du alltid hittar de mest prisvärda dryckerna &ndash; 
            oavsett om du letar efter billig sprit, prisvärt vin eller bästa öl-köpet.
          </p>
        </div>

        {/* Value props */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-white shadow-md'}`}>
            <h2 className="text-xl font-semibold mb-3">Vad är APK?</h2>
            <p>
              APK (<strong>Alkohol Per Krona</strong>) visar hur många milliliter ren alkohol du får per spenderad krona.<br></br><br></br>
              Formeln: <em>(volym&nbsp;×&nbsp;alkoholhalt)&nbsp;÷&nbsp;pris</em>. 
              Ett högre värde betyder bättre valuta för pengarna.
            </p>
          </div>

          <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-white shadow-md'}`}>
            <h2 className="text-xl font-semibold mb-3">Varför APKrona?</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>Uppdateras dagligen</li>
              <li>Jämför 20&nbsp;000+ produkter i realtid</li>
              <li>Filtrera, sök och sortera enkelt</li>
              <li>Historisk data &ndash; se APK över tid</li>
              <li>Helt gratis, utan reklam</li>
            </ul>
          </div>

          <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-white shadow-md'}`}>
            <h2 className="text-xl font-semibold mb-3">Smarta funktioner</h2>
            <ul className="list-disc list-inside space-y-2">
              <li><Link href="/ai/party-planner" className="underline hover:text-sky-500">AI Party Planner</Link> &ndash; planera festen</li>
              <li><Link href="/ai/food-pairings" className="underline hover:text-sky-500">Food Pairings</Link> &ndash; matcha mat &amp; dryck</li>
              <li><Link href="/explore" className="underline hover:text-sky-500">Utforska</Link> &ndash; upptäck nya produkter</li>
              <li><Link href="/settings" className="underline hover:text-sky-500">Glutenfritt-filter</Link></li>
            </ul>
          </div>
        </div>

        {/* Categories */}
        <div>
          <h2 className="text-2xl font-semibold mb-3">Populära kategorier på Systembolaget</h2>
          <p className="mb-4 max-w-3xl">
            Klicka på en kategori för att direkt filtrera listan och se vilka produkter som har bäst APK just nu.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {['Vodka', 'Whisky', 'Vin', 'Öl', 'Rom', 'Gin', 'Cider', 'Likör'].map(category => (
              <button 
                key={category}
                onClick={() => handleCategoryClick(category)}
                className={`p-3 text-center rounded ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-50 shadow'} transition-all cursor-pointer font-medium hover:scale-105 active:scale-95`}
                aria-label={`Filtrera på ${category} – se bäst APK`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Vanliga frågor om APK och Systembolaget</h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <details 
                key={i} 
                className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-white shadow-sm'} group`}
              >
                <summary className="font-semibold cursor-pointer list-none flex items-center justify-between">
                  <span>{faq.question}</span>
                  <span className="ml-2 transition-transform group-open:rotate-180">▾</span>
                </summary>
                <p className="mt-3 leading-relaxed opacity-90">{'richAnswer' in faq ? faq.richAnswer : faq.answer}</p>
              </details>
            ))}
          </div>
        </div>

        {/* How it works */}
        <div>
          <h2 className="text-2xl font-semibold mb-3">Så fungerar APKrona.se</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { step: '1', title: 'Vi hämtar data', desc: 'Varje dag samlar vi in priser, volymer och alkoholhalter från Systembolagets hela sortiment.' },
              { step: '2', title: 'Vi beräknar APK', desc: 'Vår algoritm beräknar alkohol per krona för varje produkt och rankar dem automatiskt.' },
              { step: '3', title: 'Du sparar pengar', desc: 'Filtrera, sök och jämför för att hitta den mest prisvärda drycken för just dig.' },
            ].map(item => (
              <div key={item.step} className={`p-5 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-white shadow-sm'}`}>
                <div className="text-sky-500 text-2xl font-bold mb-2">Steg {item.step}</div>
                <h3 className="font-semibold mb-1">{item.title}</h3>
                <p className="text-sm opacity-90">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </article>
    </section>
  );
}
