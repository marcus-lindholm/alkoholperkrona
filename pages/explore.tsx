import React, { useEffect, useState, useRef } from 'react';
import Cookies from 'js-cookie';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDoubleDown } from '@fortawesome/free-solid-svg-icons';
import translateType from '../app/components/TranslateType';
import MobileNav from '../app/components/MobileNav';
import Navbar from '@/app/components/Navbar';
import Styles from './explore.module.css';
import Head from 'next/head';

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
  const [isGlutenFree, setIsGlutenFree] = useState(false);
  const [currentProductIndex, setCurrentProductIndex] = useState(0);
  const [fetchCount, setFetchCount] = useState(0);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [hasAutoScrolled, setHasAutoScrolled] = useState(0);
  const [userHasScrolled, setUserHasScrolled] = useState(false);
  const endOfListRef = useRef<HTMLDivElement>(null);
  const reelsContainerRef = useRef<HTMLDivElement>(null);
  const isFetchingRef = useRef(false);

  const handleThemeToggle = () => {
    setIsDarkMode(prevMode => {
      const newMode = !prevMode;
      Cookies.set('darkMode', newMode.toString(), { expires: 365 });
      return newMode;
    });
  };

  const fetchProducts = async (glutenFree: boolean) => {
    if (loading || isFetchingRef.current) return;
    isFetchingRef.current = true;
    setLoading(true);
    console.log('Fetching products...');
    try {
      const params = new URLSearchParams({
        random: 'true',
        isGlutenFree: glutenFree.toString(),
      });

      const response = await fetch(`/api/products?${params.toString()}`);
      const data = await response.json();
      setProducts((prevProducts) => [...prevProducts, ...data]);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
      setFetchCount(prevCount => prevCount + 1);
      isFetchingRef.current = false;
    }
  };

  useEffect(() => {
    const darkModeCookie = Cookies.get('darkMode');
    setIsDarkMode(darkModeCookie === 'true');

    const glutenFreeCookie = Cookies.get('isGlutenFree');
    const glutenFreePreference = glutenFreeCookie === 'true';
    setIsGlutenFree(glutenFreePreference);

    fetchProducts(glutenFreePreference);
  }, []);

  const handleScroll = () => {
    setUserHasScrolled(true);

    if (reelsContainerRef.current) {
      const scrollTop = reelsContainerRef.current.scrollTop;
      const screenHeight = window.innerHeight;
      const currentIndex = Math.floor((scrollTop + screenHeight) / screenHeight);
      setCurrentProductIndex(currentIndex);
  
      if (currentIndex >= (20 * fetchCount) - 3) {
        fetchProducts(isGlutenFree);
      }
    }
  };
  
  useEffect(() => {
    const reelsContainer = reelsContainerRef.current;
    if (reelsContainer) {
      reelsContainer.addEventListener('scroll', handleScroll);
    }
  
    return () => {
      if (reelsContainer) {
        reelsContainer.removeEventListener('scroll', handleScroll);
      }
    };
  }, [fetchCount, isGlutenFree]);

  useEffect(() => {
    if (!userHasScrolled) {
      const timeout = setTimeout(() => {
        const interval = setInterval(() => {
          setScrollPosition(prevPosition => {
            const screenHeight = window.innerHeight;
            const maxScroll = reelsContainerRef.current?.scrollHeight ? reelsContainerRef.current.scrollHeight - screenHeight : 0;
            setHasAutoScrolled(prevScrolled => {
              if (prevScrolled >= 1) {
                clearInterval(interval);
                return prevScrolled;
              }
              return prevScrolled + 1;
            });
            if (prevPosition >= maxScroll) {
              return 0; // Scroll back to the top
            } else if (prevPosition === 0) {
              return screenHeight; // Scroll down one product
            } else {
              return 0; // Scroll back up
            }
          });
        }, 250); // Adjust the interval as needed

        return () => clearInterval(interval);
      }, 10000); // Wait for 5000ms before starting the interval

      return () => clearTimeout(timeout);
    }
  }, [userHasScrolled]);

  useEffect(() => {
    if (reelsContainerRef.current) {
      reelsContainerRef.current.scrollTo({
        top: scrollPosition,
        behavior: 'smooth',
      });
    }
  }, [scrollPosition]);

  return (
    <div className={`w-full h-screen flex flex-col ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-black'}`}>
      <Head>
        <title>APKrona.se - Utforska</title>
      </Head>
      <div className="fixed top-0 w-full z-50">
        <Navbar isDarkMode={isDarkMode} handleThemeToggle={handleThemeToggle} />
      </div>
      {loading && products.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-gray-400"></div>
        </div>
      ) : (
        <div ref={reelsContainerRef} className={`${Styles.reelsContainer}`}>
          {products.map((product, index) => (
            <div key={product.id} className={`w-full flex flex-col items-center justify-start sm:justify-center p-4 pt-20 sm:pt-0 ${Styles.reel} ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-black'}`}>
              <div className={`w-full max-w-md p-4 border rounded-lg shadow-lg ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'}`}>
                <div className="flex justify-between items-start mb-4">
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
              <div className="flex items-center justify-center mt-4">
                <FontAwesomeIcon icon={faAngleDoubleDown} size="2x" className={`${Styles.scrollArrowIcon}`} />
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