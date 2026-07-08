import { FaHome, FaCog, FaCompass } from 'react-icons/fa';
import { RiMagicFill } from 'react-icons/ri';
import Link from 'next/link';

type MobileNavProps = {
  isDarkMode: boolean;
  currentPage: string;
};

const MobileNav = ({ isDarkMode, currentPage }: MobileNavProps) => {
  return (
    <div className={`fixed bottom-0 left-0 right-0 ${isDarkMode ? 'bg-gray-800 border-t border-gray-700' : 'bg-white border-t border-gray-200'} flex justify-around items-center h-16 z-30`}>
      <Link href="/" aria-label="Hem">
        <div className={`flex flex-col items-center ${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'}`}>
          <FaHome className={`text-xl ${currentPage === 'home' ? (isDarkMode ? 'text-white' : 'text-black') : 'text-gray-500'}`} />
          <span className="text-xs mt-1">Hem</span>
        </div>
      </Link>
      <Link href="/explore" aria-label="Utforska">
        <div className={`flex flex-col items-center ${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'}`}>
          <FaCompass className={`text-xl ${currentPage === 'explore' ? (isDarkMode ? 'text-white' : 'text-black') : 'text-gray-500'}`} />
          <span className="text-xs mt-1">Utforska</span>
        </div>
      </Link>
      <Link href="/ai" aria-label="AI-tjänster">
        <div className={`flex flex-col items-center ${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'}`}>
          <RiMagicFill className={`text-xl ${currentPage === 'ai' ? (isDarkMode ? 'text-white' : 'text-black') : 'text-gray-500'}`} />
          <span className="text-xs mt-1">AI</span>
        </div>
      </Link>
      <Link href="/settings" aria-label="Inställningar">
        <div className={`flex flex-col items-center ${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'}`}>
          <FaCog className={`text-xl ${currentPage === 'settings' ? (isDarkMode ? 'text-white' : 'text-black') : 'text-gray-500'}`} />
          <span className="text-xs mt-1">Inställningar</span>
        </div>
      </Link>
    </div>
  );
};

export default MobileNav;