"use client"

import React, { useEffect, useState } from 'react';
import { faArrowUpRightFromSquare, faSearch } from '@fortawesome/free-solid-svg-icons';
import Image from "next/image";
import ProductComponent from './components/ProductComponent';
import ProductComponentMobile from './components/ProductComponentMobile';
import FilterComponent from './components/FilterComponent';
import MobileFilterComponent from './components/MobileFilterComponent';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { format } from 'date-fns';
import Navbar from './components/Navbar';
import MobileNav from './components/MobileNav';
import FooterComponent from './components/FooterComponent';
import { faArrowUpShortWide, faArrowDownShortWide, faSliders } from '@fortawesome/free-solid-svg-icons';
import { displaySortCriteria, displayFilterType, displayNestedFilterType } from './components/TranslateType';

export default function Home({ searchParams }: { searchParams: any }) {
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<ProductType[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isBeastMode, setBeastMode] = useState(false);
  const [showDetailedInfo, setShowDetailedInfo] = useState(false);
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
    img: string;
  };

  async function fetchProducts(page: number, filterType: string | null, nestedFilter: string | null, filterOrdervara: boolean, searchQuery: string, sortCriteria: string, sortOrder: string) {
    const userPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const localDarkMode = localStorage.getItem('darkMode');
    const darkModePreference = localDarkMode ? (localDarkMode === 'true') : userPrefersDark;
    setIsDarkMode(darkModePreference);
    const glutenFreePreference = localStorage.getItem('isGlutenFree') === 'true';

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
        isGlutenFree: glutenFreePreference.toString(),
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
    const beastModePreference = localStorage.getItem('beastMode') === 'true';
    setBeastMode(beastModePreference);
  }, []);

  //hook when show detailed info preference changes
  useEffect(() => {
    const detailedInfoPreference = localStorage.getItem('showDetailedInfo') === 'true';
    setShowDetailedInfo(detailedInfoPreference);
  }, []);

  const handleThemeToggle = () => {
    setIsDarkMode(prevMode => {
      const newMode = !prevMode;
      localStorage.setItem('darkMode', newMode.toString());
      return newMode;
    });
  };

  const loadMore = () => {
    if (page < totalPages) {
      setIsLoadMoreLoading(true);
      setPage(prevPage => prevPage + 1);
    }
  };

  return (
    <main className={`flex w-full min-h-screen flex-col items-center justify-between p-4 sm:p-8 md:p-16 lg:p-24 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-black'}`}>
      <Navbar isDarkMode={isDarkMode} handleThemeToggle={handleThemeToggle} />
      <div className="w-full mt-14 sm:mt-0 left-4 flex items-left">
        {lastUpdated ? (
          <span className="text-xs text-gray-400">Senast uppdaterad: {lastUpdated}</span>
        ) : (
          <span className="text-xs text-gray-400 invisible">Senast uppdaterad: 0000-00-00 00:00</span>
        )}
      </div>
      <div className="w-full flex justify-center relative sm:mb-0 mb-14">
      {!isLoading && (
        <>
          <button
                onClick={() => {
                  document.getElementById('mobile-filter-toggle-button')?.click();
                }}
                className={`flex items-center space-x-1 text-sm ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}
              >
            <div className="block lg:hidden absolute left-2 top-4 max-w-[72vw] break-words">
              {!isLoading && (
                <span
                  className={`flex items-center space-x-1 text-sm ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}
                >
                  <FontAwesomeIcon icon={faSliders} />
                  
                  {searchQuery && (
                    <span
                      className={`ml-2 px-2 py-1 text-xs rounded-full ${
                        isDarkMode ? 'bg-sky-600 text-white' : 'bg-sky-200 text-black'
                      } flex items-center space-x-1`}
                    >
                      <FontAwesomeIcon icon={faSearch} />
                      <span>{searchQuery.length > 5 ? `${searchQuery.substring(0, 5)}...` : searchQuery}</span>
                    </span>
                  )}

                  {/* Filter chip */}
                  {filterType && !nestedFilter && (
                    <span
                      className={`ml-2 px-2 py-1 text-xs rounded-full ${
                        isDarkMode ? 'bg-sky-600 text-white' : 'bg-sky-200 text-black'
                      }`}
                    >
                      {displayFilterType(filterType)}
                    </span>
                  )}

                  {/* Nested filter chip */}
                  {nestedFilter && (
                    <span
                      className={`ml-2 px-2 py-1 text-xs rounded-full ${
                        isDarkMode ? 'bg-sky-600 text-white' : 'bg-sky-200 text-black'
                      }`}
                    >
                      {displayNestedFilterType(nestedFilter)}
                    </span>
                  )}

                  {/* Ordervaror chip */}
                  {filterOrdervara ? (
                    <span
                      className={`ml-2 px-2 py-1 text-xs rounded-full ${
                        isDarkMode ? 'bg-sky-600 text-white' : 'bg-sky-200 text-black'
                      }`}
                    >
                      Ordervaror
                    </span>
                  ) : (
                    <span
                      className={`ml-2 px-2 py-1 text-xs rounded-full ${
                        isDarkMode ? 'bg-sky-900 text-white' : 'bg-gray-300 text-gray-800'
                      }`}
                    >
                      Ej Ordervaror
                    </span>
                  )}
                </span>
              )}
            </div>
            <div className="block lg:hidden absolute right-2 top-5">
                <FontAwesomeIcon icon={sortOrder === 'asc' ? faArrowUpShortWide : faArrowDownShortWide} />
                <span> {displaySortCriteria(sortCriteria)}</span>
            </div>
          </button>
        </>
      )}
      </div>
      <div className="flex flex-col items-center w-full">
        <div className="w-full flex sm:justify-start justify-center mt-6 sm:mt-4 hidden lg:block">
          <FilterComponent
            isDarkMode={isDarkMode}
            isBeastMode={isBeastMode}
            filterType={filterType}
            nestedFilter={nestedFilter}
            filterOrdervara={filterOrdervara}
            searchQuery={searchQuery}
            setFilterType={setFilterType}
            setNestedFilter={setNestedFilter}
            setFilterOrdervara={setFilterOrdervara}
            setSearchQuery={setSearchQuery}
          />
        </div>
        <div className="w-full min-h-screen flex justify-center">
          {isLoading ? (
            <div className="flex justify-center items-center w-full h-5/6">
              <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-gray-400"></div>
            </div>
          ) : (
            <div className="w-full">
              {products.length === 0 ? (
                <div className="text-center my-4 pt-14">
                  <p className="text-medium">Tyvärr kunde vi inte hitta några produkter med den sökningen :( <br />Du kan söka efter namn, varumärken, typ, land eller &quot;nyhet&quot;</p>
                  <p className="text-xs">Sökfunktionen är ständigt under utveckling och kommer bli bättre med tiden.</p>
                </div>
              ) : (
                <>
                  <div className="block lg:hidden">
                    <ProductComponentMobile products={products} isDarkMode={isDarkMode} isBeastMode={isBeastMode} showDetailedInfo={showDetailedInfo} />
                  </div>
                  <div className="hidden lg:block">
                    <ProductComponent
                      products={products} 
                      isDarkMode={isDarkMode} 
                      isBeastMode={isBeastMode} 
                      showDetailedInfo={showDetailedInfo} 
                      sortCriteria={sortCriteria}
                      sortOrder={sortOrder}
                      setSortCriteria={setSortCriteria}
                      setSortOrder={setSortOrder}
                    />
                  </div>
                  {page < totalPages && (
                    <div className="text-center my-4">
                      <button onClick={loadMore} className={`px-4 py-2 rounded ${isDarkMode ? 'bg-sky-600 text-white hover:bg-sky-500' : 'bg-sky-400 text-white hover:bg-sky-500'} transition duration-300 ease-in-out`}>
                        {isLoadMoreLoading ? (
                          <div className="flex items-center justify-center">
                            <div className="h-6 w-6 border-white border-4 border-dashed rounded-full animate-spin"></div>
                          </div>
                        ) : (
                          'Visa fler'
                        )}
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="block sm:hidden">
        <MobileNav isDarkMode={isDarkMode} currentPage={"home"} />
      </div>
      <FooterComponent isDarkMode={isDarkMode} isLoading={isLoading} />
      <div className="block lg:hidden">
        <MobileFilterComponent
          isDarkMode={isDarkMode}
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
          isBeastMode={false}
        />
      </div>
    </main>
  );
}