import React, { useEffect, useState, useRef } from 'react';
import Cookies from 'js-cookie';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown, faArrowUp, faArrowUpRightFromSquare, faStarOfLife, faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import translateType from '../app/components/TranslateType';
import MobileNav from '../app/components/MobileNav';
import Navbar from '@/app/components/Navbar';

type ProductType = {
  id: string;
  brand: string;
  name: string;
  apk: number;
  type: string | null;
  alcohol: number;
  volume: number;
  price: number;
  url: string;
  rankingHistory: string | null;
  vpk: number;
  createdAt: Date;
  updatedAt: Date;
  img: string;
};

const Explore = ({ showDetailedInfo }: { showDetailedInfo: boolean }) => {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const mobileNavRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const preventDefault = (e: { preventDefault: () => any; }) => e.preventDefault();

    const mobileNavElement = mobileNavRef.current;
    if (mobileNavElement) {
      mobileNavElement.addEventListener('touchmove', preventDefault, { passive: false });
      mobileNavElement.addEventListener('scroll', preventDefault, { passive: false });
    }

    return () => {
      if (mobileNavElement) {
        mobileNavElement.removeEventListener('touchmove', preventDefault);
        mobileNavElement.removeEventListener('scroll', preventDefault);
      }
    };
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products?random=true');
      const data = await response.json();
      setProducts((prevProducts) => [...prevProducts, ...data]);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const darkModeCookie = Cookies.get('darkMode');
    setIsDarkMode(darkModeCookie === 'true');
  }, []);

  useEffect(() => {
    if (currentIndex === products.length - 3) {
      fetchProducts();
    }
  }, [currentIndex]);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => Math.min(prevIndex + 1, products.length - 1));
  };

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  return (
    <div className={`w-full h-screen flex flex-col ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-black'}`}>
        <Navbar isDarkMode={isDarkMode} />
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-gray-400"></div>
          </div>
        ) : (
            <div>
            {products.map((product, index) => (
              <div key={product.id} className="w-full h-screen flex flex-col items-center justify-center p-4">
                <div className={`w-full max-w-md p-4 border rounded-lg shadow-lg mb-24 ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'}`}>
                  <div className="flex justify-between items-center mb-4">
                    <a href={product.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      <div className="text-2xl text-center">
                        {product.brand}
                        <span className="ml-2"><strong>{product.name}</strong></span>
                      </div>
                    </a>
                  </div>
                  <div className="flex flex-col items-center">
                    {product.img && (
                      <a href={product.url} target="_blank" rel="noopener noreferrer">
                        <img src={product.img} alt={product.brand} className="object-contain w-72 h-72 rounded mb-4" />
                      </a>
                    )}
                    <div className="text-center mb-4">
                      <span className="text-2xl font-bold">{product.price.toFixed(2)} kr</span>
                    </div>
                    <div className="text-center mb-1">
                        <span className="text-sm opacity-85">{translateType(product.type)}</span>
                    </div>
                    <div className="text-center mb-4 grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm opacity-85">APK: {product.apk}</span><br />
                        <span className="text-sm opacity-85">Volym/kr: {product.vpk}</span><br />
                      </div>
                      <div>
                        <span className="text-sm opacity-85">Volym: {product.volume} ml</span><br />
                        <span className="text-sm opacity-85">Alkohol: {product.alcohol} %</span><br />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      <div ref={mobileNavRef}>
        <MobileNav isDarkMode={isDarkMode} currentPage={"explore"} />
      </div>
    </div>
  );
};

export default Explore;