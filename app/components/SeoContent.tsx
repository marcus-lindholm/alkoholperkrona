import React from 'react';

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
      // Scroll to top to see the filtered results
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  return (
    <section className={`w-full max-w-6xl mx-auto mt-16 mb-8 px-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
      <article className="space-y-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            APKrona.se - Sveriges Bästa APK-Jämförare för Systembolaget
          </h1>
          <p className="text-lg leading-relaxed">
            Välkommen till <strong>APKrona.se</strong>, Sveriges mest kompletta och uppdaterade 
            APK-jämförare för Systembolagets sortiment. Vi hjälper dig hitta produkterna med 
            <strong> högst alkohol per krona (APK)</strong> så att du får mest valuta för pengarna.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-white shadow-md'}`}>
            <h2 className="text-2xl font-semibold mb-3">🎯 Vad är APK?</h2>
            <p>
              APK (Alkohol Per Krona) är ett mått som visar hur mycket alkohol du får för varje 
              krona du spenderar. Högre APK betyder bättre värde för pengarna. Vi beräknar APK 
              automatiskt för alla produkter på Systembolaget.
            </p>
          </div>

          <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-white shadow-md'}`}>
            <h2 className="text-2xl font-semibold mb-3">📊 Varför Använda APKrona?</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>Uppdateras dagligen med senaste priserna</li>
              <li>Jämför över 10,000+ produkter</li>
              <li>Filtrera på kategori, märke och pris</li>
              <li>Hitta de bästa erbjudandena snabbt</li>
            </ul>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-3">🔍 Hur Fungerar Det?</h2>
          <p className="mb-4">
            Vår plattform hämtar automatiskt all information från Systembolagets sortiment och 
            beräknar APK-värdet för varje produkt. Du kan enkelt:
          </p>
          <ol className="list-decimal list-inside space-y-2 ml-4">
            <li><strong>Sortera</strong> produkterna efter APK, pris, alkoholhalt eller volym</li>
            <li><strong>Filtrera</strong> på produkttyp (sprit, vin, öl, cider, m.m.)</li>
            <li><strong>Söka</strong> efter specifika märken eller produktnamn</li>
            <li><strong>Jämföra</strong> olika produkter för att hitta bästa värdet</li>
          </ol>
        </div>

        <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-blue-50 border border-blue-200'}`}>
          <h2 className="text-2xl font-semibold mb-3">💡 Tips för Bästa APK</h2>
          <p className="mb-3">
            Vill du maximera din budget? Här är våra bästa tips:
          </p>
          <ul className="space-y-2">
            <li>🥃 <strong>Öl</strong> har generellt högst APK jämfört med vin och sprit</li>
            <li>📦 <strong>Större flaskor</strong> ger ofta bättre värde per liter</li>
            <li>🏷️ <strong>Egna märken</strong> kan vara överraskande prisvärda</li>
            <li>🔄 <strong>Kolla regelbundet</strong> - nya produkter tillkommer ständigt</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-3">🎉 Populära Kategorier</h2>          <p className="mb-3">
            Utforska våra mest populära produktkategorier och hitta de bästa APK-värdena inom:
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {['Vodka', 'Whisky', 'Vin', 'Öl', 'Rom', 'Gin', 'Cider', 'Likör'].map(category => (
              <button 
                key={category}
                onClick={() => handleCategoryClick(category)}
                className={`p-3 text-center rounded ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-50 shadow'} transition-all cursor-pointer font-medium hover:scale-105 active:scale-95`}
                aria-label={`Filtrera på ${category}`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-3">❓ Vanliga Frågor</h3>
          <div className="space-y-4">
            <details className={`p-4 rounded ${isDarkMode ? 'bg-gray-700' : 'bg-white shadow'}`}>
              <summary className="font-semibold cursor-pointer">Hur ofta uppdateras priserna?</summary>
              <p className="mt-2">
                Vi uppdaterar vår databas dagligen för att säkerställa att du alltid har tillgång till 
                de senaste priserna och produkterna från Systembolaget.
              </p>
            </details>
            
            <details className={`p-4 rounded ${isDarkMode ? 'bg-gray-700' : 'bg-white shadow'}`}>
              <summary className="font-semibold cursor-pointer">Är APKrona officiellt kopplat till Systembolaget?</summary>
              <p className="mt-2">
                Nej, APKrona.se är en oberoende tredjepartstjänst som samlar och analyserar 
                offentlig information från Systembolagets sortiment.
              </p>
            </details>
            
            <details className={`p-4 rounded ${isDarkMode ? 'bg-gray-700' : 'bg-white shadow'}`}>
              <summary className="font-semibold cursor-pointer">Kostar det något att använda APKrona?</summary>
              <p className="mt-2">
                Nej, APKrona.se är helt gratis att använda! Vi finansieras inte genom annonser eller 
                prenumerationer, utan vill helt enkelt hjälpa dig få bästa värde för dina pengar.
              </p>
            </details>
          </div>
        </div>

        <footer className={`text-sm mt-8 pt-6 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-300'}`}>
          <p>
            <strong>Ansvarsfull alkoholkonsumtion:</strong> Kom ihåg att alltid dricka ansvarsfullt. 
            APKrona.se uppmuntrar till medveten konsumtion och följer svenska alkohollagar. Du måste 
            vara 20 år för att handla på Systembolaget.
          </p>
        </footer>
      </article>
    </section>
  );
}
