import React, { useEffect, useState, useRef, useCallback } from 'react';
import Cookies from 'js-cookie';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown, faArrowUp, faArrowUpRightFromSquare, faStarOfLife, faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import translateType from '../app/components/TranslateType';
import MobileNav from '../app/components/MobileNav';
import Navbar from '@/app/components/Navbar';
import Styles from './explore.module.css';

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
  const [loading, setLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const endOfListRef = useRef<HTMLDivElement>(null);

  const handleThemeToggle = () => {
    setIsDarkMode(prevMode => {
      const newMode = !prevMode;
      Cookies.set('darkMode', newMode.toString(), { expires: 365 });
      return newMode;
    });
  };

  useEffect(() => {
    const preventDefault = (e: { preventDefault: () => any; }) => e.preventDefault();

    const mobileNavElement = endOfListRef.current;
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
    if (loading) return;
    setLoading(true);
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

  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    const target = entries[0];
    if (target.isIntersecting && !loading) {
      fetchProducts();
    }
  }, [loading]);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: '20px',
      threshold: 1.0,
    });

    if (endOfListRef.current) {
      observerRef.current.observe(endOfListRef.current);
    }

    return () => {
      if (observerRef.current && endOfListRef.current) {
        observerRef.current.unobserve(endOfListRef.current);
      }
    };
  }, [handleObserver]);

  return (
    <div className={`w-full h-screen flex flex-col ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-black'}`}>
      <div className="fixed top-0 w-full z-50">
        <Navbar isDarkMode={isDarkMode} handleThemeToggle={handleThemeToggle} />
      </div>
      {loading && products.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-gray-400"></div>
        </div>
      ) : (
        <div className={`${Styles.reelsContainer}`}>
          {products.map((product) => (
            <div key={product.id} className={`w-full flex flex-col items-center justify-center p-4 ${Styles.reel} ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-black'}`}>
              <div className={`w-full max-w-md p-4 border rounded-lg shadow-lg ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'}`}>
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
                      <img src={product.img} alt={product.brand} className={`object-contain rounded mb-4 ${Styles.smallScreenImg}`} />
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
          <div ref={endOfListRef} className="h-1"></div>
        </div>
      )}
      <div className="block sm:hidden">
        <MobileNav isDarkMode={isDarkMode} currentPage={"explore"} />
      </div>
    </div>
  );
};

export default Explore;