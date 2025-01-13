import React, { useState, useEffect } from 'react';
import Navbar from '../app/components/Navbar';
import Cookies from 'js-cookie';
import Link from 'next/link';
import MobileNav from '@/app/components/MobileNav';
import FooterComponent from '@/app/components/FooterComponent';

const Settings = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isBeastMode, setBeastMode] = useState(false);
  const [showDetailedInfo, setShowDetailedInfo] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const darkModePreference = Cookies.get('darkMode') === 'true';
    setIsDarkMode(darkModePreference);

    const beastModePreference = Cookies.get('beastMode') === 'true';
    setBeastMode(beastModePreference);

    const detailedInfoPreference = Cookies.get('showDetailedInfo') === 'true';
    setShowDetailedInfo(detailedInfoPreference);

    setIsLoading(false); // Set loading to false after preferences are loaded
  }, []);

  const handleThemeToggle = () => {
    setIsDarkMode(prevMode => {
      const newMode = !prevMode;
      Cookies.set('darkMode', newMode.toString(), { expires: 365 });
      return newMode;
    });
  };

  const handleBeastModeToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newBeastMode = e.target.checked;
    setBeastMode(newBeastMode);
    Cookies.set('beastMode', newBeastMode.toString(), { expires: 365 });
  };

  const handleDetailedInfoToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newShowDetailedInfo = e.target.checked;
    setShowDetailedInfo(newShowDetailedInfo);
    Cookies.set('showDetailedInfo', newShowDetailedInfo.toString(), { expires: 365 });
  };

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <Navbar
        isDarkMode={isDarkMode}
        handleThemeToggle={handleThemeToggle}
      />
      <main className={`flex min-h-screen flex-col items-center justify-start p-4 sm:p-8 md:p-16 lg:p-24 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-black'}`}>
        <h1 className="text-3xl font-bold mb-4 mt-12 sm:mt-0">Inställningar</h1>
        <div className="w-full max-w-md">
          <div className="mb-4 flex flex-col sm:flex-row items-center justify-between border-b border-gray-500 border-opacity-50 pb-4">
            <label htmlFor="detailedInfo" className="mr-2">Visa detaljerad information om produkter</label>
            <label className="switch">
              <input
                id="detailedInfo"
                type="checkbox"
                checked={showDetailedInfo}
                onChange={handleDetailedInfoToggle}
              />
              <span className="slider round"></span>
            </label>
          </div>
          <div className="mb-4 flex flex-col sm:flex-row items-center justify-between border-b border-gray-500 border-opacity-50 pb-4">
            <label htmlFor="beastMode" className="mr-2">Aktivera betafunktioner (Under utveckling)</label>
            <label className="switch">
              <input
                id="beastMode"
                type="checkbox"
                checked={isBeastMode}
                onChange={handleBeastModeToggle}
              />
              <span className="slider round"></span>
            </label>
          </div>
          <Link href="/" className="inline-block px-6 py-2 mt-4 text-white bg-blue-500 rounded hover:bg-blue-600 transition duration-300 ease-in-out">
              Tillbaka till startsidan
          </Link>
        </div>
        <div className="block sm:hidden">
          <MobileNav isDarkMode={isDarkMode} currentPage={"settings"} />
        </div>
        {!isLoading && <FooterComponent isDarkMode={isDarkMode} isLoading={isLoading} />}
      </main>
    </div>
  );
};

export default Settings;