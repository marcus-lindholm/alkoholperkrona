import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faSliders, faArrowUpShortWide, faArrowDownShortWide, faXmark } from '@fortawesome/free-solid-svg-icons';
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
  onClearSearch?: () => void;
  onClearFilter?: () => void;
  onClearNestedFilter?: () => void;
  onToggleOrdervara?: () => void;
}

const FilterChips: React.FC<FilterChipsProps> = ({
  isDarkMode,
  searchQuery,
  filterType,
  nestedFilter,
  filterOrdervara,
  sortCriteria,
  sortOrder,
  isMobile = false,
  onClearSearch,
  onClearFilter,
  onClearNestedFilter,
  onToggleOrdervara
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
          } flex items-center ${isMobile ? 'gap-1' : 'gap-1.5'}`}
        >
          <FontAwesomeIcon icon={faSearch} />
          <span>{isMobile && searchQuery.length > 5 
            ? `${searchQuery.substring(0, 5)}...` 
            : searchQuery}
          </span>
          {onClearSearch && (
            <span
              onClick={(e) => {
                e.stopPropagation();
                onClearSearch();
              }}
              className={`ml-1 hover:opacity-70 transition-opacity cursor-pointer ${isMobile ? 'text-[10px]' : ''}`}
              aria-label="Clear search"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.stopPropagation();
                  onClearSearch();
                }
              }}
            >
              <FontAwesomeIcon icon={faXmark} />
            </span>
          )}
        </span>
      )}

      {/* Filter chip */}
      {filterType && !nestedFilter && (
        <span
          className={`${isMobile ? 'ml-2 px-2 py-1 text-xs' : 'px-2.5 py-0.5 text-xs'} rounded-full ${
            isDarkMode ? 'bg-sky-600 text-white' : 'bg-sky-200 text-black'
          } flex items-center ${isMobile ? 'gap-1' : 'gap-1.5'}`}
        >
          <span>{displayFilterType(filterType)}</span>
          {onClearFilter && (
            <span
              onClick={(e) => {
                e.stopPropagation();
                onClearFilter();
              }}
              className={`ml-1 hover:opacity-70 transition-opacity cursor-pointer ${isMobile ? 'text-[10px]' : ''}`}
              aria-label="Clear filter"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.stopPropagation();
                  onClearFilter();
                }
              }}
            >
              <FontAwesomeIcon icon={faXmark} />
            </span>
          )}
        </span>
      )}

      {/* Nested filter chip */}
      {nestedFilter && (
        <span
          className={`${isMobile ? 'ml-2 px-2 py-1 text-xs' : 'px-2.5 py-0.5 text-xs'} rounded-full ${
            isDarkMode ? 'bg-sky-600 text-white' : 'bg-sky-200 text-black'
          } flex items-center ${isMobile ? 'gap-1' : 'gap-1.5'}`}
        >
          <span>{displayNestedFilterType(nestedFilter)}</span>
          {onClearNestedFilter && (
            <span
              onClick={(e) => {
                e.stopPropagation();
                onClearNestedFilter();
              }}
              className={`ml-1 hover:opacity-70 transition-opacity cursor-pointer ${isMobile ? 'text-[10px]' : ''}`}
              aria-label="Clear nested filter"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.stopPropagation();
                  onClearNestedFilter();
                }
              }}
            >
              <FontAwesomeIcon icon={faXmark} />
            </span>
          )}
        </span>
      )}

      {/* Ordervaror chip */}
      {filterOrdervara ? (
        <span
          className={`${isMobile ? 'ml-2 px-2 py-1 text-xs' : 'px-2.5 py-0.5 text-xs'} rounded-full ${
            isDarkMode ? 'bg-sky-600 text-white' : 'bg-sky-200 text-black'
          } flex items-center ${isMobile ? 'gap-1' : 'gap-1.5'}`}
        >
          <span>Ordervaror</span>
          {onToggleOrdervara && (
            <span
              onClick={(e) => {
                e.stopPropagation();
                onToggleOrdervara();
              }}
              className={`ml-1 hover:opacity-70 transition-opacity cursor-pointer ${isMobile ? 'text-[10px]' : ''}`}
              aria-label="Remove ordervaror filter"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.stopPropagation();
                  onToggleOrdervara();
                }
              }}
            >
              <FontAwesomeIcon icon={faXmark} />
            </span>
          )}
        </span>
      ) : (
        <span
          className={`${isMobile ? 'ml-2 px-2 py-1 text-xs' : 'px-2.5 py-0.5 text-xs'} rounded-full ${
            isDarkMode ? 'bg-sky-900 text-white' : 'bg-gray-300 text-gray-800'
          } flex items-center ${isMobile ? 'gap-1' : 'gap-1.5'}`}
        >
          <span>Ej Ordervaror</span>
          {onToggleOrdervara && (
            <span
              onClick={(e) => {
                e.stopPropagation();
                onToggleOrdervara();
              }}
              className={`ml-1 hover:opacity-70 transition-opacity cursor-pointer ${isMobile ? 'text-[10px]' : ''}`}
              aria-label="Add ordervaror filter"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.stopPropagation();
                  onToggleOrdervara();
                }
              }}
            >
              <FontAwesomeIcon icon={faXmark} />
            </span>
          )}
        </span>
      )}
    </div>
  );
};

export default FilterChips;