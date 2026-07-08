"use client"

import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faSpinner, faUtensils, faWineGlass, faSearch, faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import Head from 'next/head';
import Navbar from '../../app/components/Navbar';
import MobileNav from '../../app/components/MobileNav';
import FooterComponent from '../../app/components/FooterComponent';
import { getApiBaseUrl } from '../../lib/api';

interface Pairing {
  productName: string;
  category: string;
  description: string;
  priceRange: string;
  servingTip: string;
}

interface PairingResult {
  introduction: string;
  pairings: Pairing[];
  generalTip: string;
}

const randomFacts = [
  "Tanninerna i rödvin binder sig till proteiner i kött och skapar en harmonisk smakbalans.",
  "En tumregel: vita viner passar till fisk och vita kött, röda till mörkt kött – men regler är till för att brytas.",
  "Champagne är ett av få viner som passar till nästan alla maträtter, tack vare sin syra och bubblor.",
  "Ölets kolsyra skär igenom fettet i stekt mat och rensar gommen på ett sätt vin inte kan.",
  "Salta rätter mildrar upplevelsen av tanniner och bitterhet – perfekt med en kraftig IPA.",
  "Äppelcider är ett klassiskt val till normandisk mat med grädde, smör och äpple.",
  "Riesling är vinets schweiziska armékniv – fungerar med allt från skaldjur till kryddstark thaimat.",
  "Portvin och blåmögelost är ett klassiskt par – sältan och fettet balanserar vinets sötma.",
  "Belgiska abbeyöl kompletterar komplexa, rika rätter som lamm och grytor utmärkt.",
  "Alkoholfri mousserande dryck med citrus passar utmärkt till lättare sallader och fisk.",
  "Prosecco till pasta all'arrabbiata – bubblorna dämpar hettan i rätten.",
  "Malbec från Argentina är gjord för grillade köttbitar – ett av vinvärldens mest självklara par.",
  "Sherry passar överraskande bra till nötter, oliver och tapas – en underskattad match.",
  "Umami i rätter som sushi och parmesan förstärks av vin med låg tanninhalt.",
];

export default function FoodPairings() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pairingResult, setPairingResult] = useState<PairingResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentFactIndex, setCurrentFactIndex] = useState(0);
  const [factVisible, setFactVisible] = useState(true);
  
  // Form state
  const [foodType, setFoodType] = useState<string>('');
  const [dishDescription, setDishDescription] = useState<string>('');
  const [mealType, setMealType] = useState<string>('Middag');
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([]);

  useEffect(() => {
    if (!loading) return;
    setCurrentFactIndex(Math.floor(Math.random() * randomFacts.length));
    setFactVisible(true);
    const interval = setInterval(() => {
      setFactVisible(false);
      setTimeout(() => {
        setCurrentFactIndex(prev => (prev + 1) % randomFacts.length);
        setFactVisible(true);
      }, 500);
    }, 8000);
    return () => clearInterval(interval);
  }, [loading]);

  useEffect(() => {
    const userPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const localDarkMode = localStorage.getItem('darkMode');
    const darkModePreference = localDarkMode ? (localDarkMode === 'true') : userPrefersDark;
    setIsDarkMode(darkModePreference);
  }, []);

  const handleThemeToggle = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    localStorage.setItem('darkMode', newTheme.toString());
  };

  const mealTypes = [
    'Frukost', 'Lunch', 'Middag', 'Efterrätt', 'Mellanmål'
  ];
  
  const preferenceOptions = [
    'Vin', 'Öl', 'Sprit', 'Cider', 'Alkoholfritt', 
    'Mousserande', 'Budget-friendly', 'Premium'
  ];

  const foodCategories = [
    'Kött (Nötkött, Lamm, etc.)',
    'Fågel (Kyckling, Kalkon, etc.)',
    'Fisk',
    'Skaldjur',
    'Vegetariskt',
    'Pasta',
    'Asiatiskt',
    'Mexikanskt',
    'Indiskt',
    'BBQ/Grillat',
    'Ost',
    'Choklad/Dessert'
  ];

  const togglePreference = (pref: string) => {
    setSelectedPreferences(prev =>
      prev.includes(pref)
        ? prev.filter(p => p !== pref)
        : [...prev, pref]
    );
  };

  const getSystembolagetSearchUrl = (productName: string) => {
    const searchQuery = productName.trim().replace(/\s+/g, '+');
    return `https://www.systembolaget.se/sortiment/?q=${searchQuery}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!foodType || !dishDescription) {
      setError('Vänligen fyll i mattyp och beskrivning av rätten.');
      return;
    }

    setLoading(true);
    setError(null);
    setPairingResult(null);

    try {
      const response = await fetch(`${getApiBaseUrl()}/api/foodPairings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          foodType,
          dishDescription,
          mealType,
          preferences: selectedPreferences
        }),
      });

      if (!response.ok) {
        throw new Error('Något gick fel vid generering av dryckesförslag');
      }

      const data = await response.json();
      setPairingResult(data);
      
      // Scroll to top when results are ready
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ett oväntat fel inträffade');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Food Pairings AI - Hitta Perfekta Drycken till Din Mat | APKrona.se</title>
        <meta name="description" content="Använd vår AI-drivna food pairing för att hitta den perfekta drycken till din mat. Få skräddarsydda förslag baserat på din måltid och preferenser." />
        <meta name="keywords" content="food pairing, mat och dryck, vin till mat, öl till mat, dryckesförslag, systembolaget pairing, ai food pairing" />
        <meta property="og:title" content="Food Pairings AI - Hitta Perfekta Drycken" />
        <meta property="og:description" content="Använd vår AI-drivna food pairing för att hitta den perfekta drycken till din mat." />
        <meta property="og:url" content="https://www.apkrona.se/ai/food-pairings" />
        <link rel="canonical" href="https://www.apkrona.se/ai/food-pairings" />
      </Head>
      
      <main className={`flex w-full min-h-screen flex-col items-center justify-between p-4 sm:p-8 md:p-16 lg:p-24 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-black'}`}>
        <Navbar isDarkMode={isDarkMode} handleThemeToggle={handleThemeToggle} />
        
        <div className="container mx-auto mt-24 mb-8">
          <div className="flex items-center mb-6">
            <Link href="/ai">
              <span className={`mr-3 p-2 rounded-full ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}>
                <FontAwesomeIcon icon={faArrowLeft} size="lg" />
              </span>
            </Link>
            <h1 className="text-3xl font-bold">Food Pairings AI</h1>
          </div>

          {pairingResult ? (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold">Dina Dryckesförslag</h2>
                <button
                  onClick={() => setPairingResult(null)}
                  className={`px-4 py-2 rounded ${isDarkMode ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-200 hover:bg-gray-300'}`}
                >
                  Ny sökning
                </button>
              </div>

              {pairingResult.introduction && (
                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-white'} shadow-lg`}>
                  <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {pairingResult.introduction}
                  </p>
                </div>
              )}

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {pairingResult.pairings.map((pairing, index) => (
                  <div 
                    key={index}
                    className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-white'} shadow-lg hover:shadow-xl transition-shadow border ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}
                  >
                    <div className="mb-4">
                      <h3 className="text-xl font-bold mb-2">{pairing.productName}</h3>
                      <span className={`inline-block px-3 py-1 rounded-full text-sm ${isDarkMode ? 'bg-sky-900 text-sky-300' : 'bg-sky-100 text-sky-700'}`}>
                        {pairing.category}
                      </span>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <h4 className={`font-semibold mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          Varför det passar:
                        </h4>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {pairing.description}
                        </p>
                      </div>

                      <div>
                        <h4 className={`font-semibold mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          Prisläge:
                        </h4>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {pairing.priceRange}
                        </p>
                      </div>

                      <div>
                        <h4 className={`font-semibold mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          Serveringstips:
                        </h4>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {pairing.servingTip}
                        </p>
                      </div>
                    </div>

                    <a
                      href={getSystembolagetSearchUrl(pairing.productName)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`mt-4 w-full inline-flex items-center justify-center px-4 py-2 rounded-lg font-semibold transition-colors ${isDarkMode ? 'bg-sky-600 hover:bg-sky-500' : 'bg-sky-500 hover:bg-sky-600 text-white'}`}
                    >
                      Sök på Systembolaget
                      <FontAwesomeIcon icon={faExternalLinkAlt} className="ml-2" size="sm" />
                    </a>
                  </div>
                ))}
              </div>

              {pairingResult.generalTip && (
                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-white'} shadow-lg`}>
                  <h4 className="font-semibold mb-2">💡 Bonustips:</h4>
                  <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {pairingResult.generalTip}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-white'} shadow-lg`}>
              <div className="mb-6">
                <FontAwesomeIcon icon={faUtensils} className="text-4xl mb-4 text-sky-500" />
                <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Beskriv din måltid så får du skräddarsydda dryckesförslag från Systembolagets sortiment.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Meal Type */}
                <div>
                  <label className="block mb-2 font-semibold">
                    <FontAwesomeIcon icon={faUtensils} className="mr-2" />
                    Typ av måltid
                  </label>
                  <select
                    value={mealType}
                    onChange={(e) => setMealType(e.target.value)}
                    className={`w-full p-3 rounded-lg ${isDarkMode ? 'bg-gray-800 border-gray-600' : 'bg-gray-50 border-gray-300'} border`}
                  >
                    {mealTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                {/* Food Category */}
                <div>
                  <label className="block mb-2 font-semibold">
                    Matkategori
                  </label>
                  <select
                    value={foodType}
                    onChange={(e) => setFoodType(e.target.value)}
                    className={`w-full p-3 rounded-lg ${isDarkMode ? 'bg-gray-800 border-gray-600' : 'bg-gray-50 border-gray-300'} border`}
                    required
                  >
                    <option value="">Välj kategori...</option>
                    {foodCategories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                {/* Dish Description */}
                <div>
                  <label className="block mb-2 font-semibold">
                    Beskriv rätten
                  </label>
                  <textarea
                    value={dishDescription}
                    onChange={(e) => setDishDescription(e.target.value)}
                    placeholder="T.ex. Grillad lax med citron och dill, serveras med rostad potatis och grönsaker"
                    className={`w-full p-3 rounded-lg ${isDarkMode ? 'bg-gray-800 border-gray-600' : 'bg-gray-50 border-gray-300'} border h-24`}
                    required
                  />
                </div>

                {/* Preferences */}
                <div>
                  <label className="block mb-3 font-semibold">
                    <FontAwesomeIcon icon={faWineGlass} className="mr-2" />
                    Preferenser (valfritt)
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {preferenceOptions.map(pref => (
                      <button
                        key={pref}
                        type="button"
                        onClick={() => togglePreference(pref)}
                        className={`p-2 text-sm rounded-lg border transition-colors ${
                          selectedPreferences.includes(pref)
                            ? isDarkMode 
                              ? 'bg-sky-600 border-sky-500 text-white' 
                              : 'bg-sky-200 border-sky-400 text-black'
                            : isDarkMode 
                              ? 'bg-gray-800 border-gray-600 hover:bg-gray-700' 
                              : 'bg-gray-50 border-gray-300 hover:bg-gray-100'
                        }`}
                      >
                        {pref}
                      </button>
                    ))}
                  </div>
                </div>

                {error && (
                  <div className="p-4 rounded-lg bg-red-500/10 border border-red-500 text-red-500">
                    {error}
                  </div>
                )}

                {loading && (
                  <div
                    className={`p-4 rounded-lg border transition-opacity duration-500 ${isDarkMode ? 'bg-gray-800 border-gray-600 text-gray-300' : 'bg-sky-50 border-sky-200 text-gray-700'}`}
                    style={{ opacity: factVisible ? 1 : 0 }}
                  >
                    <p className={`text-xs font-semibold uppercase tracking-wide mb-1 ${isDarkMode ? 'text-sky-400' : 'text-sky-600'}`}>Visste du att...</p>
                    <p className="text-sm">{randomFacts[currentFactIndex]}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
                    loading
                      ? isDarkMode 
                        ? 'bg-gray-600 cursor-not-allowed' 
                        : 'bg-gray-300 cursor-not-allowed'
                      : isDarkMode 
                        ? 'bg-sky-600 hover:bg-sky-500' 
                        : 'bg-sky-500 hover:bg-sky-600 text-white'
                  }`}
                >
                  {loading ? (
                    <>
                      <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
                      Genererar förslag...
                    </>
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faSearch} className="mr-2" />
                      Hitta dryckesförslag
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>

        <div className="block sm:hidden">
          <MobileNav isDarkMode={isDarkMode} currentPage={"ai"} />
        </div>

        <FooterComponent isDarkMode={isDarkMode} isLoading={loading} />
      </main>
    </>
  );
}
