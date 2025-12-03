"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGlassWhiskey, faWineGlass, faGlassMartiniAlt } from '@fortawesome/free-solid-svg-icons';
import Navbar from '../app/components/Navbar';
import MobileNav from '../app/components/MobileNav';
import FooterComponent from '../app/components/FooterComponent';

export default function AIHub() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check for system dark mode preference and saved user preference
    const userPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const localDarkMode = localStorage.getItem('darkMode');
    
    // Use saved preference if available, otherwise use system preference
    const darkModePreference = localDarkMode ? (localDarkMode === 'true') : userPrefersDark;
    setIsDarkMode(darkModePreference);
  }, []);

  const handleThemeToggle = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    localStorage.setItem('darkMode', newTheme.toString());
  };

  const aiFeatures = [
    {
      title: 'Party Planner',
      description: 'Planera den perfekta festen med AI-förslag på drinkar baserat på din budget och preferenser.',
      icon: faGlassWhiskey,
      path: '/ai/party-planner',
      isAvailable: true
    },
    {
      title: 'Food Pairings',
      description: 'Hitta den perfekta drycken att matcha med din mat.',
      icon: faWineGlass,
      path: '/ai/food-pairings',
      isAvailable: true
    },
    {
      title: 'Cocktail Generator',
      description: 'Få cocktailrecept baserat på vad du har hemma.',
      icon: faGlassMartiniAlt,
      path: '/ai/cocktail-generator',
      isAvailable: false
    }
  ];

  return (
    <>
      <Head>
        <title>AI Alkoholassistent - Party Planner & Cocktails | APKrona.se</title>
        <meta name="description" content="Använd vår AI-drivna party planner för att hitta de bästa dryckerna till din fest. Få smarta förslag baserat på budget och antal gäster." />
        <meta name="keywords" content="ai party planner, festplanering alkohol, cocktail ai, systembolaget ai, festdrycker, party alkohol" />
        <meta property="og:title" content="AI Alkoholassistent - Party Planner & Cocktails" />
        <meta property="og:description" content="Använd vår AI-drivna party planner för att hitta de bästa dryckerna till din fest." />
        <meta property="og:url" content="https://www.apkrona.se/ai" />
        <link rel="canonical" href="https://www.apkrona.se/ai" />
      </Head>
      <main className={`flex w-full min-h-screen flex-col items-center justify-between p-4 sm:p-8 md:p-16 lg:p-24 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-black'}`}>
        <Navbar isDarkMode={isDarkMode} handleThemeToggle={handleThemeToggle} />
        
        <div className="container mx-auto mt-24">
          <h1 className="text-3xl font-bold mb-2">AI-tjänster</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-8">
            Upptäck APKronas AI-tjänster som hjälper dig att planera fester, hitta drinkrecept och mycket mer. Observera att denna sida är i Beta-stadiet och vissa funktioner kan vara undermåliga, under utveckling eller inte tillgängliga än.
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {aiFeatures.map((feature, index) => (
              <div 
                key={index}
                className={`border rounded-lg p-6 transition-all duration-300 ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 hover:border-sky-500' 
                    : 'bg-white border-gray-200 hover:border-sky-500'
                } ${!feature.isAvailable && 'opacity-50'}`}
              >
                <div className="flex items-center mb-4">
                  <div className={`p-3 rounded-full ${isDarkMode ? 'bg-sky-900' : 'bg-sky-100'}`}>
                    <FontAwesomeIcon 
                      icon={feature.icon} 
                      className={`text-xl ${isDarkMode ? 'text-sky-400' : 'text-sky-600'}`} 
                    />
                  </div>
                  <h2 className="text-xl font-semibold ml-3">{feature.title}</h2>
                </div>
                
                <p className={`mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {feature.description}
                </p>
                
                {feature.isAvailable ? (
                  <Link href={feature.path}>
                    <span className={`inline-block px-4 py-2 rounded ${
                      isDarkMode 
                        ? 'bg-sky-600 hover:bg-sky-500 text-white' 
                        : 'bg-sky-500 hover:bg-sky-400 text-white'
                    } transition-colors`}>
                      Testa nu
                    </span>
                  </Link>
                ) : (
                  <span className="inline-block px-4 py-2 rounded bg-gray-400 text-gray-100 cursor-not-allowed">
                    Under utveckling
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
        
        <div className="block sm:hidden">
          <MobileNav isDarkMode={isDarkMode} currentPage={"ai"} />
        </div>
        
        <FooterComponent isDarkMode={isDarkMode} isLoading={isLoading} />
      </main>
    </>
  );
}