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
          <h1 className="text-2xl md:text-3xl font-bold mb-4">
            APKrona.se - APK-Jämförare
          </h1>
          <p className="text-lg leading-relaxed">
            Hitta produkter med högst APK på Systembolaget.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-white shadow-md'}`}>
            <h2 className="text-2xl font-semibold mb-3">Vad är APK?</h2>
            <p>
              APK (Alkohol Per Krona) visar hur många ml alkohol (etanol) du får per krona.
            </p>
          </div>

          <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-white shadow-md'}`}>
            <h2 className="text-2xl font-semibold mb-3">Varför APKrona?</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>Uppdateras dagligen</li>
              <li>Jämför 20,000+ produkter</li>
              <li>Filtrera, sök och sortera enkelt</li>
            </ul>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-3">Populära kategorier</h2>
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
      </article>
    </section>
  );
}
