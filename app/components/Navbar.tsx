import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faCompass, faHome, faMagicWandSparkles, faSun, faMoon } from '@fortawesome/free-solid-svg-icons';
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
    { path: '/', icon: faHome, label: 'Hem' },
    { path: '/explore', icon: faCompass, label: 'Utforska' },
    { path: '/ai', icon: faMagicWandSparkles, label: 'AI-tjänster' },
    { path: '/settings', icon: faCog, label: 'Inställningar' }
  ];

  return (
    <div className={`fixed top-0 left-0 right-0 flex justify-between items-center ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'} px-3 py-1.5 sm:p-4 z-50`}>
      <Link href="/" className="flex items-center">
        <Image
          src={"/beer_emoji.png"}
          alt="APK"
          width={18}
          height={18}
          className="object-contain sm:w-[25px] sm:h-[25px]"
        />
        <h1 className="text-base sm:text-2xl font-bold ml-1.5 sm:ml-2">APKrona.se</h1>
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
                  hoverItem === item.path ? 'max-w-[120px] opacity-100 ml-2' : 'max-w-0 opacity-0 ml-0'
                }`}>
                  {item.label}
                </span>
              </Link>
            ))}
            
          </div>
          <button
            onClick={handleThemeToggle}
            aria-label="Toggle theme"
            className="relative ml-3 sm:ml-4 flex-shrink-0 rounded-full transition-colors duration-300 focus:outline-none"
            style={{
              width: 'clamp(36px, 10vw, 56px)',
              height: 'clamp(20px, 6vw, 32px)',
              backgroundColor: isDarkMode ? '#2196F3' : '#ccc',
            }}
          >
            <span
              className="absolute flex items-center justify-center rounded-full bg-white shadow transition-transform duration-300"
              style={{
                width: 'clamp(14px, 4.2vw, 24px)',
                height: 'clamp(14px, 4.2vw, 24px)',
                top: '50%',
                transform: isDarkMode
                  ? 'translateY(-50%) translateX(calc(clamp(36px, 10vw, 56px) - clamp(14px, 4.2vw, 24px) - 3px))'
                  : 'translateY(-50%) translateX(3px)',
                fontSize: 'clamp(8px, 2.5vw, 14px)',
                lineHeight: 1,
              }}
            >
              <FontAwesomeIcon icon={isDarkMode ? faMoon : faSun} style={{ color: isDarkMode ? '#93c5fd' : '#f59e0b' }} />
            </span>
          </button>
        </div>
      )}
    </div>
  );
};

export default Navbar;