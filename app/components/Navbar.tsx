import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faCompass, faHome } from '@fortawesome/free-solid-svg-icons';

type NavbarProps = {
  isDarkMode: boolean;
  handleThemeToggle?: () => void;
};

const Navbar = ({ isDarkMode, handleThemeToggle }: NavbarProps) => {
  return (
    <div className={`fixed top-0 left-0 right-0 flex justify-between items-center ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'} p-4 z-50`}>
      <Link href="/" className="flex items-center">
        <Image
          src={"/beer_emoji.png"}
          alt="APK"
          width={25}
          height={25}
          className="object-contain"
        />
        <h1 className="text-2xl font-bold ml-2">APKrona.se</h1>
      </Link>
      {handleThemeToggle && (
        <div className="flex items-center">
          <div className="hidden sm:flex">
            <Link href="/" className="ml-4 mr-4">
              <FontAwesomeIcon 
                icon={faHome} 
                size="lg" 
                className={!isDarkMode ? 'text-gray-700' : ''} 
              />
            </Link>
            <Link href="/explore" className="ml-4 mr-4">
              <FontAwesomeIcon 
                icon={faCompass} 
                size="lg" 
                className={!isDarkMode ? 'text-gray-700' : ''} 
              />
            </Link>
            <Link href="/settings" className="ml-4 mr-4">
              <FontAwesomeIcon 
                icon={faCog} 
                size="lg" 
                className={!isDarkMode ? 'text-gray-700' : ''} 
              />
            </Link>
          </div>
          <label className="switch ml-4">
            <input type="checkbox" checked={isDarkMode} onChange={handleThemeToggle} />
            <span className="slider round"></span>
          </label>
          <span className="ml-2">{isDarkMode ? '🌙' : '☀️'}</span>
        </div>
      )}
    </div>
  );
};

export default Navbar;