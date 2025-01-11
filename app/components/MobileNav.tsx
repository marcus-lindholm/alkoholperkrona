import { FaHome, FaSearch, FaCog } from 'react-icons/fa';
import Link from 'next/link';

type MobileNavProps = {
  isDarkMode: boolean;
  currentPage: string;
};

const MobileNav = ({ isDarkMode, currentPage }: MobileNavProps) => {
  return (
    <div className={`fixed bottom-0 left-0 right-0 ${isDarkMode ? 'bg-gray-800 border-t border-gray-700' : 'bg-white border-t border-gray-200'} flex justify-around items-center h-16 z-30`}>
      <Link href="/">
        <div className={`flex flex-col items-center ${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'}`}>
          <FaHome className={`text-2xl ${currentPage === 'home' ? (isDarkMode ? 'text-white' : 'text-black') : 'text-gray-500'}`} />
        </div>
      </Link>
      <Link href="/explore">
        <div className={`flex flex-col items-center ${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'}`}>
          <FaSearch className={`text-2xl ${currentPage === 'explore' ? (isDarkMode ? 'text-white' : 'text-black') : 'text-gray-500'}`} />
          <span className="text-xs">Utforska</span>
        </div>
      </Link>
      <Link href="/settings">
        <div className={`flex flex-col items-center ${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'}`}>
          <FaCog className={`text-2xl ${currentPage === 'settings' ? (isDarkMode ? 'text-white' : 'text-black') : 'text-gray-500'}`} />
        </div>
      </Link>
    </div>
  );
};

export default MobileNav;