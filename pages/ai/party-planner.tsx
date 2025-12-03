"use client"

import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faSpinner, faFlask, faUtensils, faMoneyBill, faUsers, faClock } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import Navbar from '../../app/components/Navbar';
import MobileNav from '../../app/components/MobileNav';
import FooterComponent from '../../app/components/FooterComponent';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import 'tailwindcss/tailwind.css';
import styles from '../../styles/Markdown.module.css';

export default function PartyPlanner() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [partyPlan, setPartyPlan] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Form state
  const [guests, setGuests] = useState<number>(10);
  const [budget, setBudget] = useState<number>(1000);
  const [eventType, setEventType] = useState<string>('Middag');
  const [duration, setDuration] = useState<string>('4');
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([]);

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

  const eventTypes = [
    'Middag', 'Förfest', 'Fest', 'Bröllop', 'Firmafest', 'Julbord', 
    'Grillkväll', 'Picknick', 'Hemmakväll'
  ];
  
  const preferenceOptions = [
    'Öl', 'Vin', 'Sprit', 'Cider', 'Alkoholfritt', 
    'Vegetariskt', 'Ekologiskt', 'Lokalt', 'Alkoholstarkt',
    'Budgetvänligt', 'Premium', 'Craftbeer', 'Mousserande'
  ];

  const togglePreference = (preference: string) => {
    if (selectedPreferences.includes(preference)) {
      setSelectedPreferences(selectedPreferences.filter(p => p !== preference));
    } else {
      setSelectedPreferences([...selectedPreferences, preference]);
    }
  };

  const generatePlan = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/partyPlanner', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          guests,
          budget,
          eventType,
          duration,
          preferences: selectedPreferences
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Ett fel uppstod vid generering av festplan');
      }
      
      setPartyPlan(data.plan);
      
      // Scroll to top when results are ready
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('Error generating party plan:', error);
      setError(error instanceof Error ? error.message : 'Ett fel uppstod');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setPartyPlan(null);
    setError(null);
  };

  return (
    <main className={`flex w-full min-h-screen flex-col items-center justify-between p-4 sm:p-8 md:p-16 lg:p-24 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-black'}`}>
      <Navbar isDarkMode={isDarkMode} handleThemeToggle={handleThemeToggle} />
      
      <div className="container mx-auto mt-24 mb-24 max-w-4xl">
        <div className="flex items-center mb-8">
          <Link href="/ai">
            <span className={`mr-3 p-2 rounded-full ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}>
              <FontAwesomeIcon icon={faArrowLeft} />
            </span>
          </Link>
          <h1 className="text-3xl font-bold">AI Party Planner</h1>
        </div>
        
        {partyPlan ? (
          <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-white'} shadow-lg`}>
            <div className="mb-6 flex justify-between">
              <h2 className="text-2xl font-bold">Din festplan är klar!</h2>
              <button 
                onClick={resetForm}
                className={`px-4 py-2 rounded ${isDarkMode ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-200 hover:bg-gray-300'}`}
              >
                Gör en ny plan
              </button>
            </div>
            
            <div className={`prose ${isDarkMode ? 'prose-invert' : ''} max-w-none prose-headings:mt-6 prose-headings:mb-4 prose-p:my-4 prose-ul:my-4 prose-li:my-1`}>
                <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                    // Add extra spacing to paragraphs
                    p: ({node, ...props}) => <p className="mb-4" {...props} />,
                    // Enhance headings
                    h1: ({node, ...props}) => <h1 className="text-3xl font-bold mt-8 mb-4" {...props} />,
                    h2: ({node, ...props}) => <h2 className="text-2xl font-bold mt-6 mb-3" {...props} />,
                    h3: ({node, ...props}) => <h3 className="text-xl font-semibold mt-5 mb-2" {...props} />,
                    // Add styles to lists
                    ul: ({node, ...props}) => <ul className="list-disc pl-6 mb-4" {...props} />,
                    li: ({node, ...props}) => <li className="mb-2" {...props} />
                    }}
                >
                    {partyPlan}
                </ReactMarkdown>
            </div>
            
            <div className="mt-6 text-sm text-gray-500 dark:text-gray-400">
              <p>Denna plan är genererad av AI och är endast förslag. Du kan behöva anpassa den efter dina behov.</p>
              <p>APKrona.se tar inget ansvar för eventuella felaktigheter i denna plan.</p>
            </div>
          </div>
        ) : (
          <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-white'} shadow-lg`}>
            <p className="mb-6">Fyll i detaljerna nedan för att få en anpassad dryckesplan för ditt event.</p>
            
            {error && (
              <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
                {error}
              </div>
            )}
            
            <form onSubmit={(e) => { e.preventDefault(); generatePlan(); }}>
              <div className="mb-6">
                <label className="block mb-2 font-medium">
                  <FontAwesomeIcon icon={faUsers} className="mr-2" />
                  Antal gäster
                </label>
                <input
                  type="number"
                  value={guests}
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    // Allow empty string to clear the field completely
                    if (inputValue === '') {
                      setGuests(0);
                    } else {
                      setGuests(parseInt(inputValue) || 1);
                    }
                  }}
                  min="0"
                  max="100"
                  className={`w-full p-3 rounded-lg ${isDarkMode ? 'bg-gray-800 border-gray-600' : 'bg-gray-50 border-gray-300'} border`}
                  required
                />
              </div>
              
              <div className="mb-6">
                <label className="block mb-2 font-medium">
                  <FontAwesomeIcon icon={faMoneyBill} className="mr-2" />
                  Budget (SEK)
                </label>
                <input
                  type="number"
                  value={budget}
                  onChange={(e) => setBudget(parseInt(e.target.value) || 0)}
                  min="100"
                  step="100"
                  className={`w-full p-3 rounded-lg ${isDarkMode ? 'bg-gray-800 border-gray-600' : 'bg-gray-50 border-gray-300'} border`}
                  required
                />
              </div>
              
              <div className="mb-6">
                <label className="block mb-2 font-medium">
                  <FontAwesomeIcon icon={faUtensils} className="mr-2" />
                  Typ av event
                </label>
                <select
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value)}
                  className={`w-full p-3 rounded-lg ${isDarkMode ? 'bg-gray-800 border-gray-600' : 'bg-gray-50 border-gray-300'} border`}
                  required
                >
                  {eventTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              
              <div className="mb-6">
                <label className="block mb-2 font-medium">
                  <FontAwesomeIcon icon={faClock} className="mr-2" />
                  Längd på event (timmar)
                </label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className={`w-full p-3 rounded-lg ${isDarkMode ? 'bg-gray-800 border-gray-600' : 'bg-gray-50 border-gray-300'} border`}
                  required
                >
                  <option value="2">2 timmar</option>
                  <option value="3">3 timmar</option>
                  <option value="4">4 timmar</option>
                  <option value="5">5 timmar</option>
                  <option value="6">6+ timmar</option>
                </select>
              </div>
              
              <div className="mb-6">
                <label className="block mb-2 font-medium">
                  <FontAwesomeIcon icon={faFlask} className="mr-2" />
                  Preferenser (valfritt)
                </label>
                <div className="flex flex-wrap gap-2">
                  {preferenceOptions.map((preference) => (
                    <button
                      type="button"
                      key={preference}
                      onClick={() => togglePreference(preference)}
                      className={`px-3 py-1 rounded-full text-sm ${
                        selectedPreferences.includes(preference)
                          ? isDarkMode 
                            ? 'bg-sky-600 text-white' 
                            : 'bg-sky-500 text-white'
                          : isDarkMode 
                            ? 'bg-gray-600 text-gray-300' 
                            : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      {preference}
                    </button>
                  ))}
                </div>
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className={`w-full p-3 rounded-lg font-medium ${
                  isDarkMode 
                    ? 'bg-sky-600 hover:bg-sky-500 text-white' 
                    : 'bg-sky-500 hover:bg-sky-400 text-white'
                } transition-colors`}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
                    Genererar plan...
                  </span>
                ) : 'Generera festplan'}
              </button>
            </form>
          </div>
        )}
      </div>
      
      <div className="block sm:hidden">
        <MobileNav isDarkMode={isDarkMode} currentPage={"ai"} />
      </div>
      
      <FooterComponent isDarkMode={isDarkMode} isLoading={false} />
    </main>
  );
}