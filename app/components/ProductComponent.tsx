import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown, faArrowUp, faArrowUpRightFromSquare, faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import React, { useState } from 'react';
import RankingHistoryChart from './RankingHistoryChart';
import translateType from './TranslateType';

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
  BeverageRanking: { date: Date; ranking: number }[];
};

type ProductComponentProps = {
  products: ProductType[];
  isDarkMode: boolean;
  isBeastMode: boolean;
  showDetailedInfo: boolean;
  sortCriteria: string;
  sortOrder: string;
  setSortCriteria: (criteria: string) => void;
  setSortOrder: (order: string) => void;
};

const ProductComponent = ({ products = [], isDarkMode, isBeastMode, showDetailedInfo, sortCriteria, sortOrder, setSortCriteria, setSortOrder }: ProductComponentProps) => {
  const [expandedProduct, setExpandedProduct] = useState<string | null>(null);

  const handleSort = (criteria: string) => {
    if (sortCriteria === criteria) {
      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
    } else {
      setSortCriteria(criteria);
      setSortOrder('desc');
    }
  };

  return (
    <div className={`overflow-x-auto w-full mt-10 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
      <table className={`min-w-full border ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>
        <thead>
          <tr>
            <th className={`px-4 py-2 border-b text-left cursor-pointer transition duration-200 ${isDarkMode ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-200 hover:bg-gray-100'}`} onClick={() => handleSort('apk')}>#</th>
            <th className={`px-4 py-2 border-b text-left cursor-pointer transition duration-200 ${isDarkMode ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-200 hover:bg-gray-100'}`} onClick={() => handleSort('apk')}>
              APK (ml/kr) {sortCriteria === 'apk' && (sortOrder === 'asc' ? <FontAwesomeIcon icon={faArrowUp} /> : <FontAwesomeIcon icon={faArrowDown} />)}
            </th>
            <th className={`px-4 py-2 border-b text-left transition duration-200 ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>Namn</th>
            <th className={`px-4 py-2 border-b text-left transition duration-200 ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>Typ</th>
            <th className={`px-4 py-2 border-b text-left cursor-pointer transition duration-200 ${isDarkMode ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-200 hover:bg-gray-100'}`} onClick={() => handleSort('price')}>
              Pris {sortCriteria === 'price' && (sortOrder === 'asc' ? <FontAwesomeIcon icon={faArrowUp} /> : <FontAwesomeIcon icon={faArrowDown} />)}
            </th>
            <th className={`px-4 py-2 border-b text-left cursor-pointer transition duration-200 ${isDarkMode ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-200 hover:bg-gray-100'}`} onClick={() => handleSort('volume')}>
              Volym {sortCriteria === 'volume' && (sortOrder === 'asc' ? <FontAwesomeIcon icon={faArrowUp} /> : <FontAwesomeIcon icon={faArrowDown} />)}
            </th>
            <th className={`px-4 py-2 border-b text-left cursor-pointer transition duration-200 ${isDarkMode ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-200 hover:bg-gray-100'}`} onClick={() => handleSort('alcohol')}>
              Alkoholhalt {sortCriteria === 'alcohol' && (sortOrder === 'asc' ? <FontAwesomeIcon icon={faArrowUp} /> : <FontAwesomeIcon icon={faArrowDown} />)}
            </th>
            <th className={`px-4 py-2 border-b text-left transition duration-200 ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}></th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => {
            const latestRanking = product.BeverageRanking[0]?.ranking || 'N/A';
            const rankingHistoryData = product.BeverageRanking.map(entry => ({
              date: entry.date.toString(),
              rank: entry.ranking,
              apk: product.apk,
            }));

            return (
              <React.Fragment key={index}>
                <tr className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} ${index % 2 === 0 ? (isDarkMode ? 'bg-gray-700' : 'bg-gray-50') : (isDarkMode ? 'bg-gray-800' : 'bg-white')}`}>
                  <td className={`px-4 py-2 border-b whitespace-nowrap overflow-hidden ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                    {latestRanking}
                  </td>
                  <td className={`px-4 py-2 border-b ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>{product.apk}</td>
                  <td className={`px-4 py-2 border-b ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                    <a href={product.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      <strong>{product.brand} <FontAwesomeIcon icon={faArrowUpRightFromSquare} size="xs" /></strong><br/>
                      {showDetailedInfo && <span className='text-sm opacity-85'>{product.name}</span>}
                    </a>
                  </td>
                  <td className={`px-4 py-2 border-b whitespace-nowrap overflow-hidden ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>{translateType(product.type)}</td>
                  <td className={`px-4 py-2 border-b whitespace-nowrap overflow-hidden ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>{product.price.toFixed(2)} kr</td>
                  <td className={`px-4 py-2 border-b whitespace-nowrap overflow-hidden ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>{product.volume} ml</td>
                  <td className={`px-4 py-2 border-b whitespace-nowrap overflow-hidden ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>{product.alcohol} %</td>
                  <td className={`px-4 py-2 border-b whitespace-nowrap overflow-hidden ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                    {isBeastMode && (
                      <button onClick={() => setExpandedProduct(expandedProduct === product.id ? null : product.id)}>
                        <FontAwesomeIcon icon={expandedProduct === product.id ? faChevronUp : faChevronDown} />
                      </button>
                    )}
                  </td>
                </tr>
                {expandedProduct === product.id && (
                  <tr className={`hover:${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} ${index % 2 === 0 ? (isDarkMode ? 'bg-gray-700' : 'bg-gray-50') : (isDarkMode ? 'bg-gray-800' : 'bg-white')}`}>
                    <td colSpan={8} className={`px-4 py-2 border-b ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                      <RankingHistoryChart data={rankingHistoryData} isDarkMode={isDarkMode} />
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ProductComponent;