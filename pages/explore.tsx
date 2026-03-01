import React, { useEffect, useState, useRef, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDoubleDown } from '@fortawesome/free-solid-svg-icons';
import translateType from '../app/components/TranslateType';
import MobileNav from '../app/components/MobileNav';
import Navbar from '@/app/components/Navbar';
import Styles from './explore.module.css';
import Head from 'next/head';
import Image from 'next/image';
import { getApiBaseUrl } from '../lib/api';

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
  const hasInitializedRef = useRef(false);
  const touchStartY = useRef<number | null>(null);
  const isScrolling = useRef(false);
  
  const handleThemeToggle = () => {
    setIsDarkMode(prevMode => {
      const newMode = !prevMode;
      localStorage.setItem('darkMode', newMode.toString());
      return newMode;
    });
  };

  const fetchProducts = useCallback(async (glutenFree: boolean) => {
    if (loading || isFetchingRef.current) return;
    isFetchingRef.current = true;
    setLoading(true);
    console.log('Fetching products...');
    try {
      const params = new URLSearchParams({
        random: 'true',
        isGlutenFree: glutenFree.toString(),
      });

      const response = await fetch(`${getApiBaseUrl()}/api/products?${params.toString()}`);
      const data = await response.json();
      setProducts((prevProducts) => [...prevProducts, ...data]);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
      setFetchCount(prevCount => prevCount + 1);
      isFetchingRef.current = false;
    }
  }, []); // Remove loading dependency since we use isFetchingRef

  const handleScroll = useCallback(() => {
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
  }, [fetchCount, isGlutenFree, fetchProducts]);

  useEffect(() => {
    if (hasInitializedRef.current) return; // Prevent multiple initializations
    hasInitializedRef.current = true;
    
    const userPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const localDarkMode = localStorage.getItem('darkMode');
    const darkModePreference = localDarkMode ? (localDarkMode === 'true') : userPrefersDark;
    setIsDarkMode(darkModePreference);
  
    const glutenFreePreference = localStorage.getItem('isGlutenFree') === 'true';
    setIsGlutenFree(glutenFreePreference);
    fetchProducts(glutenFreePreference);
  }, []); // Empty dependency array - only run once on mount

  // Touch handlers to limit each swipe to exactly one product
  const handleTouchStart = useCallback((e: TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    // Prevent native scroll so we can control it ourselves
    if (touchStartY.current !== null) {
      e.preventDefault();
    }
  }, []);

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    if (touchStartY.current === null || !reelsContainerRef.current || isScrolling.current) return;

    const touchEndY = e.changedTouches[0].clientY;
    const deltaY = touchStartY.current - touchEndY;
    const threshold = 30; // minimum swipe distance in px

    if (Math.abs(deltaY) > threshold) {
      const screenHeight = window.innerHeight;
      const currentSnap = Math.round(reelsContainerRef.current.scrollTop / screenHeight);
      const targetSnap = deltaY > 0 ? currentSnap + 1 : currentSnap - 1;
      const clampedSnap = Math.max(0, targetSnap);

      isScrolling.current = true;
      reelsContainerRef.current.scrollTo({
        top: clampedSnap * screenHeight,
        behavior: 'smooth',
      });

      // Reset scrolling lock after animation completes
      setTimeout(() => {
        isScrolling.current = false;
      }, 400);
    }

    touchStartY.current = null;
  }, []);

  useEffect(() => {
    const reelsContainer = reelsContainerRef.current;
    if (reelsContainer) {
      reelsContainer.addEventListener('scroll', handleScroll);
      reelsContainer.addEventListener('touchstart', handleTouchStart, { passive: true });
      reelsContainer.addEventListener('touchmove', handleTouchMove, { passive: false });
      reelsContainer.addEventListener('touchend', handleTouchEnd, { passive: true });
    }
  
    return () => {
      if (reelsContainer) {
        reelsContainer.removeEventListener('scroll', handleScroll);
        reelsContainer.removeEventListener('touchstart', handleTouchStart);
        reelsContainer.removeEventListener('touchmove', handleTouchMove);
        reelsContainer.removeEventListener('touchend', handleTouchEnd);
      }
    };
  }, [handleScroll, handleTouchStart, handleTouchMove, handleTouchEnd]);

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
    <>
      <Head>
        <title>Utforska APK - Systembolagets Bästa Erbjudanden | APKrona.se</title>
        <meta name="description" content="Upptäck nya produkter med hög APK på Systembolaget. Swipea dig igenom de mest prisvärda dryckerna och hitta nya favoriter. Uppdateras dagligen!" />
        <meta name="keywords" content="systembolaget apk, upptäck alkohol, swipe alkohol, bästa apk, prisvärd alkohol, systembolaget erbjudanden" />
        <meta property="og:title" content="Utforska APK - Systembolagets Bästa Erbjudanden" />
        <meta property="og:description" content="Upptäck nya produkter med hög APK på Systembolaget. Swipea dig igenom de mest prisvärda dryckerna." />
        <meta property="og:url" content="https://www.apkrona.se/explore" />
        <link rel="canonical" href="https://www.apkrona.se/explore" />
        <link rel="dns-prefetch" href="https://product-cdn.systembolaget.se" />
        <link rel="preconnect" href="https://product-cdn.systembolaget.se" />
      </Head>
      <div className={`w-full h-screen flex flex-col ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-black'}`}>
        <div className="fixed top-0 w-full z-50">
          <Navbar isDarkMode={isDarkMode} handleThemeToggle={handleThemeToggle} />
        </div>
        {loading && products.length === 0 ? (
          <div className="flex items-center justify-center h-full pt-20 sm:pt-0">
            <div className={`w-full max-w-md p-4 border rounded-lg shadow-lg animate-pulse ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'}`}>
              {/* Brand / Name skeleton */}
              <div className="flex justify-center mb-4">
                <div className={`w-48 h-6 rounded ${isDarkMode ? 'bg-gray-600' : 'bg-gray-200'}`} />
              </div>
              {/* Image skeleton */}
              <div className="flex flex-col items-center">
                <div className={`w-[200px] h-[200px] rounded mb-4 ${isDarkMode ? 'bg-gray-600' : 'bg-gray-200'}`} />
                {/* Price skeleton */}
                <div className={`w-28 h-7 rounded mb-4 ${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'}`} />
                {/* Type skeleton */}
                <div className={`w-20 h-4 rounded mb-4 ${isDarkMode ? 'bg-gray-600' : 'bg-gray-200'}`} />
                {/* Stats skeleton */}
                <div className="grid grid-cols-2 gap-4 mb-4 w-full">
                  <div className="space-y-2 flex flex-col items-center">
                    <div className={`w-24 h-4 rounded ${isDarkMode ? 'bg-gray-600' : 'bg-gray-200'}`} />
                    <div className={`w-28 h-4 rounded ${isDarkMode ? 'bg-gray-600' : 'bg-gray-200'}`} />
                  </div>
                  <div className="space-y-2 flex flex-col items-center">
                    <div className={`w-28 h-4 rounded ${isDarkMode ? 'bg-gray-600' : 'bg-gray-200'}`} />
                    <div className={`w-24 h-4 rounded ${isDarkMode ? 'bg-gray-600' : 'bg-gray-200'}`} />
                  </div>
                </div>
              </div>
            </div>
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
                  </div>                  <div className="flex flex-col items-center">
                    {product.img && (
                      <a href={product.url} target="_blank" rel="noopener noreferrer">
                        <Image 
                          src={product.img.replace('/300/', '/200/')} 
                          alt={product.brand} 
                          width={200}
                          height={200}
                          className={`object-contain rounded mb-4 ${Styles.smallScreenImg}`}
                          loading={index < 3 ? 'eager' : 'lazy'}
                          priority={index < 2}
                          unoptimized
                        />
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
                        <span className="text-sm opacity-85">Volym/kr: {product.vpk.toFixed(3)}</span><br />
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
    </>
  );
};

export default Explore;