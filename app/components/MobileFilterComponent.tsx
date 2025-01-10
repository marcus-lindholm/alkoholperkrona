import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faTimes, faFilter, faTrash } from '@fortawesome/free-solid-svg-icons';
import Cookies from 'js-cookie';

type MobileFilterProps = {
  isDarkMode: boolean;
  isBeastMode: boolean;
  filterType: string | null;
  nestedFilter: string | null;
  filterOrdervara: boolean;
  searchQuery: string;
  sortCriteria: string;
  sortOrder: string;
  setFilterType: (value: string | null) => void;
  setNestedFilter: (value: string | null) => void;
  setFilterOrdervara: (value: boolean) => void;
  setSearchQuery: (value: string) => void;
  setSortCriteria: (value: string) => void;
  setSortOrder: (value: string) => void;
};

const MobileFilterComponent = ({
  isDarkMode,
  isBeastMode,
  filterType,
  nestedFilter,
  filterOrdervara,
  searchQuery,
  sortCriteria,
  sortOrder,
  setFilterType,
  setNestedFilter,
  setFilterOrdervara,
  setSearchQuery,
  setSortCriteria,
  setSortOrder,
}: MobileFilterProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleFilter = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const hasExpandedBefore = Cookies.get('hasExpandedBefore');
    if (!hasExpandedBefore) {
      const expandTimer = setTimeout(() => {
        setIsExpanded(true);
      }, 5000);

      const retractTimer = setTimeout(() => {
        setIsExpanded(false);
        Cookies.set('hasExpandedBefore', 'true', { expires: 365 });
      }, 15000);

      return () => {
        clearTimeout(expandTimer);
        clearTimeout(retractTimer);
      };
    }
  }, []);

  return (
    <>
      <button
        onClick={toggleFilter}
        className={`fixed bottom-20 right-5 opacity-85 ${isDarkMode ? 'bg-sky-600 text-white' : 'bg-sky-400 text-white'} h-16 rounded-full z-50 flex items-center justify-center transition-all duration-500 ${isExpanded ? 'w-64' : 'w-16'}`}
      >
        <FontAwesomeIcon icon={faFilter} className="w-6 h-6" />
        {isExpanded && (
          <span className="ml-4 text-white">Sök och Filtrera här</span>
        )}
      </button>
      <div 
        onClick={toggleFilter}
        className={`fixed inset-0 bg-black z-40 transition-opacity duration-300 ${isOpen ? 'opacity-50' : 'opacity-0 pointer-events-none'}`}
      ></div>
      <div
        className={`fixed inset-x-0 bottom-0 mb-16 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-black'} p-4 rounded-t-lg shadow-lg z-40 transform transition-transform duration-300 ${
          isOpen ? 'translate-y-0' : 'translate-y-full'
        } h-3/4 overflow-y-auto`}
      >
        <button onClick={toggleFilter} className="absolute top-4 right-4 text-gray-500 hover:text-gray-600">
          <FontAwesomeIcon icon={faTimes} className="w-6 h-6" />
        </button>
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="flex items-center relative w-full">
            <input
              id="search"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Sök"
              className={`w-full px-3 py-2 pl-10 border rounded ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-black border-gray-200'}`}
            />
            <FontAwesomeIcon icon={faSearch} className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-600"
              >
                <FontAwesomeIcon icon={faTimes} className="w-4 h-4" />
              </button>
            )}
          </div>
          <div className="w-full">
            <label htmlFor="filter" className="block text-sm font-medium mb-1">Filter:</label>
            <select
              id="filter"
              value={filterType || ""}
              onChange={(e) => {
                setFilterType(e.target.value || null);
                setNestedFilter(null);
              }}
              className={`w-full px-3 py-2 border rounded ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-black border-gray-200'}`}
            >
              <option value="">Allt</option>
              <option value="beer">Öl</option>
              <option value="wine">Vin</option>
              <option value="liquor">Sprit</option>
              <option value="cider">Cider & blanddrycker</option>
            </select>
          </div>
          {filterType && (
            <div className="w-full">
              <label htmlFor="nestedFilter" className="block text-sm font-medium mb-1">Underkategori:</label>
              <select
                id="nestedFilter"
                value={nestedFilter || ""}
                onChange={(e) => setNestedFilter(e.target.value || null)}
                className={`w-full px-3 py-2 border rounded ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-black border-gray-200'}`}
              >
                {filterType === "beer" && (
                  <>
                    <option value="">Alla öl</option>
                    <option value="lager">Ljus lager</option>
                    <option value=" ale">Ale</option> {/* This should say " ale" fetch the correct product type */}
                    <option value="ipa">IPA</option>
                    <option value="syrlig öl">Syrlig öl</option>
                    <option value="porter och stout">Porter & Stout</option>
                    <option value="mörk lager">Mellanmörk & mörk lager</option>
                    <option value="veteöl">Veteöl</option>
                    <option value="annan öl">Annat öl</option>
                  </>
                )}
                {filterType === "wine" && (
                  <>
                    <option value="">Alla viner</option>
                    <option value="rött">Rödvin</option>
                    <option value="vitt">Vitt vin</option>
                    <option value="rosé">Rosévin</option>
                    <option value="mousserande">Mousserande vin</option>
                    <option value="starkvin">Starkvin</option>
                  </>
                )}
                {filterType === "liquor" && (
                  <>
                    <option value="">Alla spritdrycker</option>
                    <option value="whiskey">Whiskey</option>
                    <option value="vodka">Vodka</option>
                    <option value="rom">Rom</option>
                    <option value=" gin">Gin</option> {/* This should say " gin" with a space to fetch the correct product type */}
                    <option value="tequila">Tequila</option>
                    <option value="likör">Likör</option>
                    <option value="akvavit">Akvavit</option>
                    <option value="kryddat brännvin">Kryddat brännvin</option>
                    <option value="cognac">Cognac</option>
                    <option value="grappa">Grappa</option>
                    <option value="fruktsprit">Fruktsprit</option>
                    <option value="bitter">Bitter</option>
                    <option value="calvados">Calvados</option>
                    <option value="drinkar & cocktails">Drinkar & cocktails</option>
                    <option value="punsch">Punch</option>
                  </>
                )}
                {filterType === "cider" && (
                  <>
                    <option value="">Alla cider</option>
                    <option value="torr">Torr cider</option>
                    <option value="söt">Söt cider</option>
                    <option value="blanddryck">Blanddryck</option>
                  </>
                )}
              </select>
            </div>
          )}
          <div className="w-full flex items-center justify-center space-x-2">
            <label htmlFor="ordervara" className="text-sm font-medium">Visa ordervaror:</label>
            <div className="relative inline-block w-10 align-middle select-none transition duration-200 ease-in">
                <input
                id="ordervara"
                type="checkbox"
                checked={filterOrdervara}
                onChange={(e) => setFilterOrdervara(e.target.checked)}
                className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                />
                <label
                htmlFor="ordervara"
                className={`toggle-label block overflow-hidden h-6 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'}`}
                ></label>
            </div>
            </div>
          <div className="w-full">
            <label htmlFor="sortCriteria" className="block text-sm font-medium mb-1">Sortera på:</label>
            <select
              id="sortCriteria"
              value={sortCriteria}
              onChange={(e) => setSortCriteria(e.target.value)}
              className={`w-full px-3 py-2 border rounded ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-black border-gray-200'}`}
            >
              <option value="apk">APK</option>
              <option value="price">Pris</option>
              <option value="volume">Volym</option>
              <option value="alcohol">Volymprocent</option>
              <option value="vpk">Volym/kr</option>
            </select>
          </div>
          <div className="w-full">
            <label htmlFor="sortOrder" className="block text-sm font-medium mb-1">Sorteringsordning:</label>
            <select
              id="sortOrder"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className={`w-full px-3 py-2 border rounded ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-black border-gray-200'}`}
            >
              <option value="asc">Stigande ↑</option>
              <option value="desc">Sjunkande ↓</option>
            </select>
          </div>
          <div className="w-full flex space-x-2 mt-4">
            <button
                onClick={() => {
                setFilterType(null);
                setNestedFilter(null);
                setFilterOrdervara(false);
                setSearchQuery('');
                setSortCriteria('apk');
                setSortOrder('desc');
                }}
                className={`w-1/6 py-3 rounded ${isDarkMode ? 'bg-red-600 text-white' : 'bg-red-400 text-white'} text-lg font-semibold`}
            >
                <FontAwesomeIcon icon={faTrash} className="w-5 h-5" />
            </button>
            <button
                onClick={toggleFilter}
                className={`w-5/6 py-3 rounded ${isDarkMode ? 'bg-sky-600 text-white' : 'bg-sky-400 text-white'} text-lg font-semibold`}
            >
                Filtrera
            </button>
            </div>
        </div>
      </div>
    </>
  );
};

export default MobileFilterComponent;