import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faSliders, faArrowUpShortWide, faArrowDownShortWide, faXmark, faCheck } from '@fortawesome/free-solid-svg-icons';
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
  setSortCriteria?: (value: string) => void;
  setSortOrder?: (value: string) => void;
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
  onToggleOrdervara,
  setSortCriteria,
  setSortOrder
}) => {
  const [showSortMenu, setShowSortMenu] = useState(false);
  const sortMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sortMenuRef.current && !sortMenuRef.current.contains(event.target as Node)) {
        setShowSortMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const sortOptions = [
    { value: 'apk', label: 'APK' },
    { value: 'price', label: 'Pris' },
    { value: 'alcohol', label: 'Alkoholhalt' },
    { value: 'volume', label: 'Volym' },
    { value: 'vpk', label: 'Volym/kr' },
  ];

  return (
    <div className={`${isMobile ? 'flex flex-wrap items-center gap-1 max-w-[72vw]' : 'flex flex-wrap items-center gap-2'}`}>
      {isMobile && <FontAwesomeIcon icon={faSliders} />}

      {/* Sort criteria - only show on desktop view as a clickable chip */}
      {!isMobile && (
        <div className="relative" ref={sortMenuRef}>
          <span
            onClick={() => setShowSortMenu(!showSortMenu)}
            className={`px-2.5 py-0.5 text-xs rounded-full ${
              isDarkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            } flex items-center gap-1.5 cursor-pointer select-none transition-colors`}
          >
            <FontAwesomeIcon icon={sortOrder === 'asc' ? faArrowUpShortWide : faArrowDownShortWide} />
            <span>{displaySortCriteria(sortCriteria)}</span>
          </span>

          {/* Sort popup menu */}
          {showSortMenu && setSortCriteria && setSortOrder && (
            <div className={`absolute top-full left-0 mt-2 w-52 rounded-lg shadow-lg border z-50 ${
              isDarkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-200'
            }`}>
              <div className={`px-3 py-2 text-xs font-semibold uppercase tracking-wider ${
                isDarkMode ? 'text-gray-400 border-b border-gray-600' : 'text-gray-500 border-b border-gray-200'
              }`}>Sortera efter</div>
              {sortOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    setSortCriteria(option.value);
                    setShowSortMenu(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-sm flex items-center justify-between transition-colors ${
                    isDarkMode
                      ? 'hover:bg-gray-700 text-white'
                      : 'hover:bg-gray-100 text-gray-800'
                  } ${sortCriteria === option.value ? (isDarkMode ? 'bg-gray-700' : 'bg-gray-100') : ''}`}
                >
                  <span>{option.label}</span>
                  {sortCriteria === option.value && (
                    <FontAwesomeIcon icon={faCheck} className="w-3 h-3 text-sky-500" />
                  )}
                </button>
              ))}
              <div className={`border-t ${
                isDarkMode ? 'border-gray-600' : 'border-gray-200'
              }`}>
                <div className={`px-3 py-2 text-xs font-semibold uppercase tracking-wider ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>Ordning</div>
                <button
                  onClick={() => {
                    setSortOrder('desc');
                    setShowSortMenu(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-sm flex items-center justify-between transition-colors ${
                    isDarkMode
                      ? 'hover:bg-gray-700 text-white'
                      : 'hover:bg-gray-100 text-gray-800'
                  } ${sortOrder === 'desc' ? (isDarkMode ? 'bg-gray-700' : 'bg-gray-100') : ''}`}
                >
                  <span className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faArrowDownShortWide} className="w-3 h-3" />
                    Fallande
                  </span>
                  {sortOrder === 'desc' && (
                    <FontAwesomeIcon icon={faCheck} className="w-3 h-3 text-sky-500" />
                  )}
                </button>
                <button
                  onClick={() => {
                    setSortOrder('asc');
                    setShowSortMenu(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-sm flex items-center justify-between rounded-b-lg transition-colors ${
                    isDarkMode
                      ? 'hover:bg-gray-700 text-white'
                      : 'hover:bg-gray-100 text-gray-800'
                  } ${sortOrder === 'asc' ? (isDarkMode ? 'bg-gray-700' : 'bg-gray-100') : ''}`}
                >
                  <span className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faArrowUpShortWide} className="w-3 h-3" />
                    Stigande
                  </span>
                  {sortOrder === 'asc' && (
                    <FontAwesomeIcon icon={faCheck} className="w-3 h-3 text-sky-500" />
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
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