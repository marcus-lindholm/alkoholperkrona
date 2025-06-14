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
                className={`ml-4 mr-4 relative ${
                  isActive(item.path) 
                    ? (isDarkMode ? 'text-sky-400' : 'text-sky-600') 
                    : hoverItem === item.path 
                      ? (isDarkMode ? 'text-sky-300' : 'text-sky-500')
                      : (!isDarkMode ? 'text-gray-700' : 'text-gray-300')
                } transition-colors duration-200`}
                onMouseEnter={() => setHoverItem(item.path)}
                onMouseLeave={() => setHoverItem(null)}
              >
                <FontAwesomeIcon icon={item.icon} size="lg" />
              </Link>
            ))}
            
            {/* Active indicator */}
            <span 
              className={`absolute -bottom-2 h-1 w-4 rounded-full bg-sky-500 transition-all duration-300 ease-in-out ${
                hoverItem !== null ? 'opacity-70' : 'opacity-100'
              }`}
              style={{
                left: `${
                  navItems.findIndex(item => 
                    hoverItem 
                      ? item.path === hoverItem 
                      : isActive(item.path) ? item.path : null
                  ) * 53 + 27
                }px`,
                transform: 'translateX(-50%)'
              }}
            />
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