import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faSliders, faArrowUpShortWide, faArrowDownShortWide } from '@fortawesome/free-solid-svg-icons';
import { displayFilterType, displayNestedFilterType, displaySortCriteria } from './TranslateType';

interface FilterChipsProps {
  isDarkMode: boolean;
  searchQuery: string;
  filterType: string | null;
  nestedFilter: string | null;
  filterOrdervara: boolean;
  sortCriteria: string;
  sortOrder: string;
  isMobile?: boolean;
}

const FilterChips: React.FC<FilterChipsProps> = ({
  isDarkMode,
  searchQuery,
  filterType,
  nestedFilter,
  filterOrdervara,
  sortCriteria,
  sortOrder,
  isMobile = false
}) => {
  return (
    <div className={`${isMobile ? 'flex flex-wrap items-center gap-1 max-w-[72vw]' : 'flex flex-wrap items-center gap-2'}`}>
      {isMobile && <FontAwesomeIcon icon={faSliders} />}

      {/* Sort criteria - only show on desktop view as a chip */}
      {!isMobile && (
        <span
          className={`px-2.5 py-0.5 text-xs rounded-full ${
            isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-800'
          } flex items-center gap-1.5`}
        >
          <FontAwesomeIcon icon={sortOrder === 'asc' ? faArrowUpShortWide : faArrowDownShortWide} />
          <span>{displaySortCriteria(sortCriteria)}</span>
        </span>
      )}

      {searchQuery && (
        <span
          className={`${isMobile ? 'ml-2 px-2 py-1 text-xs' : 'px-2.5 py-0.5 text-xs'} rounded-full ${
            isDarkMode ? 'bg-sky-600 text-white' : 'bg-sky-200 text-black'
          } flex items-center ${isMobile ? 'space-x-1' : 'space-x-1.5'}`}
        >
          <FontAwesomeIcon icon={faSearch} />
          <span>{isMobile && searchQuery.length > 5 
            ? `${searchQuery.substring(0, 5)}...` 
            : searchQuery}
          </span>
        </span>
      )}

      {/* Filter chip */}
      {filterType && !nestedFilter && (
        <span
          className={`${isMobile ? 'ml-2 px-2 py-1 text-xs' : 'px-2.5 py-0.5 text-xs'} rounded-full ${
            isDarkMode ? 'bg-sky-600 text-white' : 'bg-sky-200 text-black'
          }`}
        >
          {displayFilterType(filterType)}
        </span>
      )}

      {/* Nested filter chip */}
      {nestedFilter && (
        <span
          className={`${isMobile ? 'ml-2 px-2 py-1 text-xs' : 'px-2.5 py-0.5 text-xs'} rounded-full ${
            isDarkMode ? 'bg-sky-600 text-white' : 'bg-sky-200 text-black'
          }`}
        >
          {displayNestedFilterType(nestedFilter)}
        </span>
      )}

      {/* Ordervaror chip */}
      {filterOrdervara ? (
        <span
          className={`${isMobile ? 'ml-2 px-2 py-1 text-xs' : 'px-2.5 py-0.5 text-xs'} rounded-full ${
            isDarkMode ? 'bg-sky-600 text-white' : 'bg-sky-200 text-black'
          }`}
        >
          Ordervaror
        </span>
      ) : (
        <span
          className={`${isMobile ? 'ml-2 px-2 py-1 text-xs' : 'px-2.5 py-0.5 text-xs'} rounded-full ${
            isDarkMode ? 'bg-sky-900 text-white' : 'bg-gray-300 text-gray-800'
          }`}
        >
          Ej Ordervaror
        </span>
      )}
    </div>
  );
};

export default FilterChips;