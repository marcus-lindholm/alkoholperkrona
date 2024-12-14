"use client"

import React, { useEffect, useState } from 'react';
import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';
import Cookies from 'js-cookie';
import Image from "next/image";
import RunScraperButton from './components/RunScraperButton';
import ProductComponent from './components/ProductComponent';
import ProductComponentMobile from './components/ProductComponentMobile';
import LoadingSpinner from './components/LoadingSpinner';
import FilterComponent from './components/FilterComponent';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { format } from 'date-fns';
import Link from 'next/link';

export default function Home({ searchParams }: { searchParams: any }) {
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<ProductType[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isBeastMode, setBeastMode] = useState(false);
  const [isLoadMoreLoading, setIsLoadMoreLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  const [filterType, setFilterType] = useState<string | null>(null);
  const [nestedFilter, setNestedFilter] = useState<string | null>(null);
  const [filterOrdervara, setFilterOrdervara] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortCriteria, setSortCriteria] = useState<string>('apk');
  const [sortOrder, setSortOrder] = useState<string>('desc');

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
  };

  async function fetchProducts(page: number, filterType: string | null, nestedFilter: string | null, filterOrdervara: boolean, searchQuery: string, sortCriteria: string, sortOrder: string) {
    const darkModePreference = Cookies.get('darkMode') === 'true';
    setIsDarkMode(darkModePreference);

    console.log('fetching products');
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        filterType: filterType || '',
        nestedFilter: nestedFilter || '',
        filterOrdervara: filterOrdervara.toString(),
        searchQuery: searchQuery || '',
        sortCriteria: sortCriteria,
        sortOrder: sortOrder,
      });

      const response = await fetch(`/api/products?${params.toString()}`);
      const data = await response.json();
      if (page === 1) {
        setProducts(data.products);
      } else {
        setProducts(prevProducts => [...prevProducts, ...data.products]);
      }
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setIsLoading(false);
      setIsLoadMoreLoading(false);
    }
  }

  useEffect(() => {
    async function fetchLastUpdatedDate() {
      try {
        const response = await fetch('/api/lastUpdate');
        const data = await response.json();
        const formattedDate = format(new Date(data.lastUpdated), 'yyyy-MM-dd HH:mm');
        setLastUpdated(formattedDate);
      } catch (error) {
        console.error('Error fetching the last updated date:', error);
      }
    }
  
    fetchLastUpdatedDate();
  }, []);

  // hook when filters change
  useEffect(() => {
    setIsLoading(true);
    setPage(1);
    fetchProducts(1, filterType, nestedFilter, filterOrdervara, searchQuery, sortCriteria, sortOrder);
  }, [filterType, nestedFilter, filterOrdervara, searchQuery, sortCriteria, sortOrder]);

  // hook when page changes
  useEffect(() => {
    fetchProducts(page, filterType, nestedFilter, filterOrdervara, searchQuery, sortCriteria, sortOrder);
  }, [page]);

  // hook when beast mode preference changes
  useEffect(() => {
    const beastModePreference = Cookies.get('beastMode') === 'true';
    setBeastMode(beastModePreference);
  }, []);

  const handleThemeToggle = () => {
    setIsDarkMode(prevMode => {
      const newMode = !prevMode;
      Cookies.set('darkMode', newMode.toString(), { expires: 365 });
      return newMode;
    });
  };

  const handleBeastModeToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newBeastMode = e.target.checked;
    setBeastMode(newBeastMode);
    Cookies.set('beastMode', newBeastMode.toString(), { expires: 365 });
    if (newBeastMode) {
      fetchProducts(1, filterType, nestedFilter, filterOrdervara, searchQuery, sortCriteria, sortOrder);
    } else {
      setPage(1);
      setProducts([]);
      setIsLoading(true);
      fetchProducts(1, filterType, nestedFilter, filterOrdervara, searchQuery, sortCriteria, sortOrder);
    }
  };

  const loadMore = () => {
    if (page < totalPages) {
      setIsLoadMoreLoading(true);
      setPage(prevPage => prevPage + 1);
    }
  };

  return (
    <main className={`flex min-h-screen flex-col items-center justify-between p-4 sm:p-8 md:p-16 lg:p-24 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-black'}`}>
      <div className="absolute top-4 left-4 flex items-center">
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
      </div>
      <div className="absolute top-4 right-4 flex items-center">
        <label className="switch">
          <input type="checkbox" checked={isDarkMode} onChange={handleThemeToggle} />
          <span className="slider round"></span>
        </label>
        <span className="ml-2">{isDarkMode ? '🌙' : '☀️'}</span>
      </div>
      <div className="w-full mt-10 sm:mt-0 left-4 flex items-left">
        {lastUpdated ? (
          <span className="text-xs text-gray-400">Senast uppdaterad: {lastUpdated}</span>
        ) : (
          <span className="text-xs text-gray-400 invisible">Senast uppdaterad: 0000-00-00 00:00</span>
        )}
      </div>
      <div className="flex flex-col items-center w-full">
        <div className="w-full flex sm:justify-start justify-center mt-6 sm:mt-4">
          <FilterComponent
            isDarkMode={isDarkMode}
            isBeastMode={isBeastMode}
            filterType={filterType}
            nestedFilter={nestedFilter}
            filterOrdervara={filterOrdervara}
            searchQuery={searchQuery}
            sortCriteria={sortCriteria}
            sortOrder={sortOrder}
            setFilterType={setFilterType}
            setNestedFilter={setNestedFilter}
            setFilterOrdervara={setFilterOrdervara}
            setSearchQuery={setSearchQuery}
            setSortCriteria={setSortCriteria}
            setSortOrder={setSortOrder}
          />
        </div>
        <div className="w-full flex justify-center">
          {isLoading ? (
            <div className="flex justify-center items-center w-full h-64">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
            </div>
          ) : (
            <div className="w-full">
              <div className="block sm:hidden">
                <ProductComponentMobile products={products} isDarkMode={isDarkMode} isBeastMode={isBeastMode} />
              </div>
              <div className="hidden sm:block">
                <ProductComponent products={products} isDarkMode={isDarkMode} isBeastMode={isBeastMode} />
              </div>
              {page < totalPages && (
                <div className="text-center my-4">
                  <button onClick={loadMore} className={`px-4 py-2 rounded ${isDarkMode ? 'bg-sky-600 text-white hover:bg-sky-500' : 'bg-sky-400 text-white hover:bg-sky-500'} transition duration-300 ease-in-out`}>
                    {isLoadMoreLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-t-4 border-b-4 border-white"></div>
                      </div>
                    ) : (
                      'Visa fler'
                    )}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <footer className="mt-8 text-center">
        <p>Utvecklad med ❤️ av <a href="https://marcuslindholm.com" target="_blank" rel="noopener noreferrer" className="hover:underline">Marcus Lindholm {!isLoading && <FontAwesomeIcon icon={faArrowUpRightFromSquare} size="sm" />}</a></p>
        <a href="https://app.swish.nu/1/p/sw/?sw=0736426599&msg=Tack!&edit=msg&src=qr" className="flex items-center justify-center mt-4 mb-4">
          Vill du stödja denna sida? Donera en slant!
          <Image 
            src={isDarkMode ? "/Swish_dark.png" : "/Swish_light.png"} 
            alt="Swish Logo" 
            width={25} 
            height={25} 
            className="ml-2 object-contain"
          />
        </a>
        <label 
          htmlFor="fetchAll"
          className="ml-4 mr-2 text-sm"
          title="Aktivera avancerade funktioner"
        >Avancerat läge</label>
        <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
          <input
            id="fetchAll"
            type="checkbox"
            checked={isBeastMode}
            onChange={handleBeastModeToggle}
            className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
          />
          <label
            htmlFor="fetchAll"
            className={`toggle-label block overflow-hidden h-6 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'}`}
            title="Aktivera avancerade funktioner"
          ></label>
        </div>
        <p className="text-xs text-gray-500 top-0 right-0 mt-2 mr-2">APKrona.se uppdateras i regel en gång per dag. Produkter markerade som alkoholfria enligt Systembolagets defintion är exkluderade från denna lista. Eget ansvar gäller vid konsumption av alkohol. APKrona.se tar inget ansvar för hur webbplatsen brukas. Buggar förekommer. APKrona.se bör endast ses som en kul grej, inget annat. Kul att du hittade hit!</p>
      </footer>
    </main>
  );
}