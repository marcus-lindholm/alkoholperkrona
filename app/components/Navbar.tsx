import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog } from '@fortawesome/free-solid-svg-icons';

type NavbarProps = {
  isDarkMode: boolean;
  handleThemeToggle: () => void;
};

const Navbar = ({ isDarkMode, handleThemeToggle }: NavbarProps) => {
  return (
    <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
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
      <div className="flex items-center">
        <div className="hidden sm:block">
          <Link href="/settings" className="ml-4 mr-4">
              <FontAwesomeIcon 
                  icon={faCog} 
                  size="lg" 
                  className={!isDarkMode ? 'text-gray-700' : ''} 
              />
          </Link>
        </div>
        <label className="switch">
          <input type="checkbox" checked={isDarkMode} onChange={handleThemeToggle} />
          <span className="slider round"></span>
        </label>
        <span className="ml-2">{isDarkMode ? '🌙' : '☀️'}</span>
      </div>
    </div>
  );
};

export default Navbar;