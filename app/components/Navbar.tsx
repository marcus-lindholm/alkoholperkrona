import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faCompass, faHome, faMagicWandSparkles } from '@fortawesome/free-solid-svg-icons';
import { usePathname } from 'next/navigation';

type NavbarProps = {
  isDarkMode: boolean;
  handleThemeToggle?: () => void;
};

const Navbar = ({ isDarkMode, handleThemeToggle }: NavbarProps) => {
  const pathname = usePathname();
  const [hoverItem, setHoverItem] = useState<string | null>(null);
  
  const isActive = (path: string) => {
    if (!pathname) return false;
    return pathname === path || (path === '/ai' && pathname.startsWith('/ai'));
  };

  const navItems = [
    { path: '/', icon: faHome, label: 'Home' },
    { path: '/explore', icon: faCompass, label: 'Explore' },
    { path: '/ai', icon: faMagicWandSparkles, label: 'AI' },
    { path: '/settings', icon: faCog, label: 'Settings' }
  ];

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
          <div className="hidden sm:flex items-center relative">
            {navItems.map(item => (
              <Link 
                key={item.path}
                href={item.path}
                className={`ml-4 mr-4 flex items-center ${
                  isActive(item.path) 
                    ? (isDarkMode ? 'text-sky-400' : 'text-sky-600') 
                    : hoverItem === item.path 
                      ? (isDarkMode ? 'text-sky-300' : 'text-sky-500')
                      : (!isDarkMode ? 'text-gray-700' : 'text-gray-300')
                } transition-colors duration-200`}
                onMouseEnter={() => setHoverItem(item.path)}
                onMouseLeave={() => setHoverItem(null)}
              >
                <span className="relative">
                  <FontAwesomeIcon icon={item.icon} size="lg" />
                  <span className={`absolute -bottom-3 left-1/2 -translate-x-1/2 h-1 w-4 rounded-full bg-sky-500 transition-opacity duration-300 ${
                    hoverItem === item.path
                      ? 'opacity-70'
                      : !hoverItem && isActive(item.path)
                        ? 'opacity-100'
                        : 'opacity-0'
                  }`} />
                </span>
                <span className={`text-sm font-medium whitespace-nowrap overflow-hidden transition-all duration-500 ${
                  hoverItem === item.path ? 'max-w-[80px] opacity-100 ml-2' : 'max-w-0 opacity-0 ml-0'
                }`}>
                  {item.label}
                </span>
              </Link>
            ))}
            
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