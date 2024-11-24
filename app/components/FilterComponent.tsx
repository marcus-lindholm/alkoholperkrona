import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

type FilterProps = {
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

  const FilterComponent = ({
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
  }: FilterProps) => {
  return (
    <div className="mb-4 flex flex-col sm:flex-row sm:flex-wrap items-center sm:items-center justify-center sm:justify-start">
      {isBeastMode && (
        <div className="flex items-center relative mb-2 sm:mb-0 sm:mr-4">
            <input
            id="search"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Sök"
            className={`px-4 py-2 pl-10 border rounded ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-black border-gray-200'}`}
            />
            <FontAwesomeIcon icon={faSearch} className="w-5 h-5 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
        </div>
      )}
      <div className="mb-2 sm:mb-0 sm:mr-4">
        <label htmlFor="filter" className="hidden sm:inline-block mr-2 ml-2 text-sm font-medium">Filter:</label>
        <select
          id="filter"
          value={filterType || ""}
          onChange={(e) => {
            setFilterType(e.target.value || null);
            setNestedFilter(null);
          }}
          className={`px-4 py-2 border rounded ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-black border-gray-200'}`}
        >
          <option value="">Allt</option>
          <option value="beer">Öl</option>
          <option value="wine">Vin</option>
          <option value="liquor">Sprit</option>
          <option value="cider">Cider & blanddrycker</option>
        </select>
      </div>
      {filterType && (
        <div className="mb-2 sm:mb-0 sm:mr-4">
          <select
            id="nestedFilter"
            value={nestedFilter || ""}
            onChange={(e) => setNestedFilter(e.target.value || null)}
            className={`px-4 py-2 border rounded ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-black border-gray-200'}`}
          >
            {filterType === "beer" && (
              <>
                <option value="">Alla öl</option>
                <option value="lager">Lager</option>
                <option value=" ale">Ale</option>
                <option value="stout">Stout</option>
                <option value="ipa">IPA</option>
              </>
            )}
            {filterType === "wine" && (
              <>
                <option value="">Alla viner</option>
                <option value="rött">Rödvin</option>
                <option value="vitt">Vitt vin</option>
                <option value="rosé">Rosévin</option>
                <option value="mousserande">Mousserande vin</option>
              </>
            )}
            {filterType === "liquor" && (
              <>
                <option value="">Alla spritdrycker</option>
                <option value="whiskey">Whiskey</option>
                <option value="vodka">Vodka</option>
                <option value="rom">Rom</option>
                <option value="gin">Gin</option>
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
      <div className="mb-2 sm:mb-0 sm:mr-4">
        <label htmlFor="ordervara" className="mr-2 ml-2 text-sm font-medium">Visa ordervaror:</label>
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
        <>
            <div className="flex items-center mb-2 sm:mb-0">
                <label className="hidden sm:inline-block mr-2 text-sm font-medium">Sortera på:</label>
                <select
                value={sortCriteria}
                onChange={(e) => setSortCriteria(e.target.value)}
                className={`block w-full sm:w-auto px-3 py-2 sm:text-sm border rounded-md ${isDarkMode ? 'bg-gray-800 border-gray-700 text-gray-300' : 'bg-white text-black border-gray-200'}`}
                >
                <option value="apk">APK</option>
                <option value="price">Pris</option>
                <option value="volume">Volym</option>
                <option value="alcohol">Volymprocent</option>
                </select>
            </div>
            <div className="flex items-center ml-2">
                <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className={`block w-full sm:w-auto px-3 py-2 sm:text-sm border rounded-md ${isDarkMode ? 'bg-gray-800 border-gray-700 text-gray-300' : 'bg-white text-black border-gray-200'}`}
                >
                <option value="asc">Stigande ↑</option>
                <option value="desc">Sjunkande ↓</option>
                </select>
            </div>
        </>
    </div>
  );
};

export default FilterComponent;