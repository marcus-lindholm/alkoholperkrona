"use client"

import React, { useEffect, useState, useCallback } from 'react';
import { faArrowUpRightFromSquare, faSearch } from '@fortawesome/free-solid-svg-icons';
import Image from "next/image";
import { getApiBaseUrl } from '../lib/api';
import ProductComponent from './components/ProductComponent';
import ProductComponentMobile from './components/ProductComponentMobile';
import FilterComponent from './components/FilterComponent';
import MobileFilterComponent from './components/MobileFilterComponent';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { format } from 'date-fns';
import Navbar from './components/Navbar';
import MobileNav from './components/MobileNav';
import FooterComponent from './components/FooterComponent';
import FilterChips from './components/FilterChips';
import SeoContent from './components/SeoContent';
import { faArrowUpShortWide, faArrowDownShortWide, faSliders } from '@fortawesome/free-solid-svg-icons';
import { displaySortCriteria, displayFilterType, displayNestedFilterType, alcoholFacts } from './components/TranslateType';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<ProductType[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isBeastMode, setBeastMode] = useState(true);
  const [showDetailedInfo, setShowDetailedInfo] = useState(true);
  const [isLoadMoreLoading, setIsLoadMoreLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [fetchError, setFetchError] = useState(false);

  const [filterType, setFilterType] = useState<string | null>(null);
  const [nestedFilter, setNestedFilter] = useState<string | null>(null);
  const [filterOrdervara, setFilterOrdervara] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState<string>('');
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
    vpk: number;
    createdAt: Date;
    updatedAt: Date;
    img: string;
    BeverageRanking: { date: Date; ranking: number; apk: number }[];  };

  const fetchProducts = useCallback(async (page: number, filterType: string | null, nestedFilter: string | null, filterOrdervara: boolean, searchQuery: string, sortCriteria: string, sortOrder: string) => {
    const userPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const localDarkMode = localStorage.getItem('darkMode');
    const darkModePreference = localDarkMode ? (localDarkMode === 'true') : userPrefersDark;
    setIsDarkMode(darkModePreference);
    const glutenFreePreference = localStorage.getItem('isGlutenFree') === 'true';
    const beastModeStored = localStorage.getItem('beastMode');
    const beastModePreference = beastModeStored === null ? true : beastModeStored === 'true';

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
        beastMode: beastModePreference.toString(),
      });
      
      const response = await fetch(`${getApiBaseUrl()}/api/products?${params.toString()}`);
      if (!response.ok) {
        if (response.status === 500) {
          setFetchError(true);
        }
        return;
      }
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
  }, []);

  useEffect(() => {
    async function fetchLastUpdatedDate() {
      try {
        const response = await fetch(`${getApiBaseUrl()}/api/lastUpdate`);
        const data = await response.json();
        const formattedDate = format(new Date(data.lastUpdated), 'yyyy-MM-dd HH:mm');
        setLastUpdated(formattedDate);
      } catch (error) {
        console.error('Error fetching the last updated date:', error);
      }
    }
  
    fetchLastUpdatedDate();
  }, []);
  // debounce search query by 400ms
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearchQuery(searchQuery), 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // hook when filters change
  useEffect(() => {
    setIsLoading(true);
    setPage(1);
    fetchProducts(1, filterType, nestedFilter, filterOrdervara, debouncedSearchQuery, sortCriteria, sortOrder);
  }, [filterType, nestedFilter, filterOrdervara, debouncedSearchQuery, sortCriteria, sortOrder, fetchProducts]);

  // hook when page changes
  useEffect(() => {
    fetchProducts(page, filterType, nestedFilter, filterOrdervara, debouncedSearchQuery, sortCriteria, sortOrder);
  }, [page, filterType, nestedFilter, filterOrdervara, debouncedSearchQuery, sortCriteria, sortOrder, fetchProducts]);

  // hook when beast mode preference changes
  useEffect(() => {
    const beastModeStored = localStorage.getItem('beastMode');
    setBeastMode(beastModeStored === null ? true : beastModeStored === 'true');
  }, []);

  //hook when show detailed info preference changes
  useEffect(() => {
    const detailedInfoStored = localStorage.getItem('showDetailedInfo');
    setShowDetailedInfo(detailedInfoStored === null ? true : detailedInfoStored === 'true');
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

  const [randomFact, setRandomFact] = useState<string | null>(null);
  const [showRandomFact, setShowRandomFact] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<string>("");

  useEffect(() => {
    setRandomFact(alcoholFacts[Math.floor(Math.random() * alcoholFacts.length)]);
  }, []);

  useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => {
        setShowRandomFact(true);
      }, 2500);
      return () => clearTimeout(timer);
    } else {
      setShowRandomFact(false);
    }
  }, [isLoading]);

  useEffect(() => {
    function getNextMonthStart() {
      const now = new Date();
      let month = now.getMonth() + 1; // Next month
      let year = now.getFullYear();
      if (month > 11) { // December -> January next year
        month = 0;
        year += 1;
      }
      return new Date(year, month, 1, 0, 0, 0);
    }
  
    function updateCountdown() {
      const now = new Date().getTime();
      const target = getNextMonthStart().getTime();
      const distance = target - now;
  
      if (distance <= 0) {
        setTimeRemaining("0 dagar 0 timmar 0 minuter 0 sekunder");
        return;
      }
  
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);
  
      setTimeRemaining(`${days} dygn ${hours} h : ${minutes} min : ${seconds} s`);
    }
  
    updateCountdown(); // Set initial countdown
    const intervalId = setInterval(updateCountdown, 1000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <main className={`flex w-full min-h-screen flex-col items-center justify-between p-4 sm:p-8 md:p-16 lg:p-24 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-black'}`}>
      <Navbar isDarkMode={isDarkMode} handleThemeToggle={handleThemeToggle} />
      {fetchError ? (
        <div className='text-center mt-16'>
          <p className="text-white-400">
            <strong>Hoppsan!</strong> Trycket har varit högre än väntat de senaste dagarna. 😮‍💨 Eftersom sidan inte är vinstdrivande finns begränsningar på serverkapaciteten som nollställs varje månad. Om du ser detta har gränsen troligtvis redan nåtts för denna månad. <strong>Välkommen tillbaka nästa månad.</strong>
          </p>
          <h1 className="text-center mt-16 text-white-400 text-2xl font-bold">
            Öppnar igen om: <br></br> {timeRemaining}
          </h1>
        </div>
      ) : (
        <div className="items-left w-full flex flex-col">
          <div className="w-full mt-10 sm:mt-0 left-4 flex items-left">
            {lastUpdated ? (
              <span className="text-xs text-gray-400">Senast uppdaterad: {lastUpdated}</span>
            ) : (
              <span className="text-xs text-gray-400 invisible">Senast uppdaterad: 0000-00-00 00:00</span>
            )}
          </div>
          {/* Filter chips section */}
          <div className="w-full flex justify-center relative lg:mb-0 mb-14">
            {!isLoading && (
              <>
                {/* Mobile Filter Chips */}
                <button
                  onClick={() => {
                    document.getElementById('mobile-filter-toggle-button')?.click();
                  }}
                  className="flex items-center space-x-1 text-sm"
                >
                  <div className="block lg:hidden absolute left-2 top-4 max-w-[72vw] break-words">
                    {!isLoading && (
                      <FilterChips
                        isDarkMode={isDarkMode}
                        searchQuery={searchQuery}
                        filterType={filterType}
                        nestedFilter={nestedFilter}
                        filterOrdervara={filterOrdervara}
                        sortCriteria={sortCriteria}
                        sortOrder={sortOrder}
                        isMobile={true}
                        onClearSearch={() => setSearchQuery('')}
                        onClearFilter={() => {
                          setFilterType(null);
                          setNestedFilter(null);
                        }}
                        onClearNestedFilter={() => setNestedFilter(null)}
                        onToggleOrdervara={() => setFilterOrdervara(!filterOrdervara)}
                      />
                    )}
                  </div>
                  <div className="block lg:hidden absolute right-2 top-5">
                    <FontAwesomeIcon icon={sortOrder === 'asc' ? faArrowUpShortWide : faArrowDownShortWide} />
                    <span> {displaySortCriteria(sortCriteria)}</span>
                  </div>
                </button>
                
                {/* Desktop Filter Chips */}
                <div className="hidden lg:block absolute left-0 mt-2 top-16 max-w-[80vw] z-10">
                  <FilterChips
                    isDarkMode={isDarkMode}
                    searchQuery={searchQuery}
                    filterType={filterType}
                    nestedFilter={nestedFilter}
                    filterOrdervara={filterOrdervara}
                    sortCriteria={sortCriteria}
                    sortOrder={sortOrder}
                    onClearSearch={() => setSearchQuery('')}
                    onClearFilter={() => {
                      setFilterType(null);
                      setNestedFilter(null);
                    }}
                    onClearNestedFilter={() => setNestedFilter(null)}
                    onToggleOrdervara={() => setFilterOrdervara(!filterOrdervara)}
                    setSortCriteria={setSortCriteria}
                    setSortOrder={setSortOrder}
                  />
                </div>
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
                <div className="w-full mt-6 relative">
                  {/* Random fact overlay */}
                  {showRandomFact && randomFact && (
                    <div className="absolute inset-0 z-10 flex items-start justify-center pt-32 lg:pt-40 pointer-events-none">
                      <div className={`max-w-md mx-4 px-6 py-4 rounded-xl shadow-lg backdrop-blur-sm fade-in ${isDarkMode ? 'bg-gray-900/80 text-gray-200' : 'bg-white/80 text-gray-700'}`}>
                        <p className="text-xs uppercase tracking-wider font-semibold mb-1 opacity-60">Visste du att...</p>
                        <p className="text-sm leading-relaxed">{randomFact}</p>
                      </div>
                    </div>
                  )}
                  {/* Desktop skeleton: table rows */}
                  <div className="hidden lg:block">
                    <div className={`overflow-x-auto w-full mt-10 rounded ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                      {/* Table header skeleton */}
                      <div className={`flex px-4 py-3 border-b ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                        {['w-8', 'w-24', 'w-48', 'w-24', 'w-20', 'w-16', 'w-16'].map((w, i) => (
                          <div key={i} className={`${w} h-4 rounded ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} mr-6`} />
                        ))}
                      </div>
                      {/* Table row skeletons */}
                      {Array.from({ length: 12 }).map((_, i) => (
                        <div key={i} className={`flex items-center px-4 py-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-100'} animate-pulse`}>
                          <div className={`w-8 h-4 rounded ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} mr-6`} />
                          <div className={`w-20 h-4 rounded ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} mr-6`} />
                          <div className={`w-44 h-4 rounded ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} mr-6`} />
                          <div className={`w-24 h-4 rounded ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} mr-6`} />
                          <div className={`w-16 h-4 rounded ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} mr-6`} />
                          <div className={`w-14 h-4 rounded ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} mr-6`} />
                          <div className={`w-14 h-4 rounded ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`} />
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* Mobile skeleton: product cards */}
                  <div className="block lg:hidden space-y-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className={`p-4 border rounded animate-pulse ${isDarkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-white'}`}>
                        <div className="flex justify-between items-center mb-3">
                          <div className="flex items-center space-x-2">
                            <div className={`w-6 h-5 rounded ${isDarkMode ? 'bg-gray-600' : 'bg-gray-200'}`} />
                            <div className={`w-36 h-5 rounded ${isDarkMode ? 'bg-gray-600' : 'bg-gray-200'}`} />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-1">
                          <div className="space-y-2">
                            <div className={`w-12 h-3 rounded ${isDarkMode ? 'bg-gray-600' : 'bg-gray-200'}`} />
                            <div className={`w-16 h-4 rounded ${isDarkMode ? 'bg-gray-600' : 'bg-gray-200'}`} />
                            <div className={`w-20 h-3 rounded ${isDarkMode ? 'bg-gray-600' : 'bg-gray-200'}`} />
                            <div className={`w-16 h-4 rounded ${isDarkMode ? 'bg-gray-600' : 'bg-gray-200'}`} />
                            <div className={`w-24 h-7 rounded ${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'} mt-2`} />
                          </div>
                          <div className="flex flex-col items-end space-y-2">
                            <div className={`w-24 h-4 rounded ${isDarkMode ? 'bg-gray-600' : 'bg-gray-200'}`} />
                            <div className={`w-16 h-4 rounded ${isDarkMode ? 'bg-gray-600' : 'bg-gray-200'}`} />
                            <div className={`w-14 h-4 rounded ${isDarkMode ? 'bg-gray-600' : 'bg-gray-200'}`} />
                            <div className={`w-12 h-4 rounded ${isDarkMode ? 'bg-gray-600' : 'bg-gray-200'}`} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
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
        </div>      )}
      
      {/* SEO Content Section - only visible when not loading and no filters applied */}
      {!isLoading && !filterType && !nestedFilter && !searchQuery && (
        <SeoContent 
          isDarkMode={isDarkMode}
          onCategoryClick={(filterType, nestedFilter) => {
            setFilterType(filterType);
            setNestedFilter(nestedFilter);
          }}
        />
      )}
      
      <FooterComponent isDarkMode={isDarkMode} isLoading={isLoading} />
    </main>
  );
}