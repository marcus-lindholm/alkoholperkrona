import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown, faArrowUp, faArrowUpRightFromSquare, faStarOfLife, faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import React, { useState } from 'react';
import { Tooltip } from '@nextui-org/react';
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
            let latestRanking = 'N/A';
            let rankingChange = 'new'; // Default to 'new' if there are less than 4 entries
            let previousRankingBoard = 'N/A';

            if (product.BeverageRanking.length > 0) {
              const sortedRankings = [...product.BeverageRanking].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
              const latestRankingEntry = sortedRankings[0];
              const previousRankingEntry = sortedRankings[1];

              if (latestRankingEntry) {
                latestRanking = latestRankingEntry.ranking.toString();
              }

              if (sortedRankings.length < 5) {
                rankingChange = 'new';
              } else if (previousRankingEntry) {
                const previousRanking = previousRankingEntry.ranking;
                if (Number(latestRanking) < previousRanking) {
                  rankingChange = 'increased';
                  previousRankingBoard = previousRanking.toString();
                } else if (Number(latestRanking) > previousRanking) {
                  rankingChange = 'decreased';
                  previousRankingBoard = previousRanking.toString();
                } else {
                  rankingChange = 'same';
                }
              }
            }

            const priceFormatted = product.price.toFixed(2);

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
                    {rankingChange === 'increased' && (
                      <Tooltip content={`Föregående placering: ${previousRankingBoard}`} className="bg-gray-900 text-white text-sm rounded-md p-2 shadow-lg">
                        <FontAwesomeIcon icon={faArrowUp} className="text-green-500 ml-2" size="xs" />
                      </Tooltip>
                    )}
                    {rankingChange === 'decreased' && (
                      <Tooltip content={`Föregående placering: ${previousRankingBoard}`} className="bg-gray-900 text-white text-sm rounded-md p-2 shadow-lg">
                        <FontAwesomeIcon icon={faArrowDown} className="text-red-500 ml-2" size="xs" />
                      </Tooltip>
                    )}
                    {rankingChange === 'new' && (
                      <Tooltip content="Ny produkt på listan senaste veckan" className="bg-gray-900 text-white text-sm rounded-md p-2 shadow-lg">
                        <FontAwesomeIcon icon={faStarOfLife} className="text-yellow-500 ml-2" size="xs" />
                      </Tooltip>
                    )}
                  </td>
                  <td className={`px-4 py-2 border-b ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>{product.apk}</td>
                  <td className={`px-4 py-2 border-b ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                    <a href={product.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      <strong>{product.brand} <FontAwesomeIcon icon={faArrowUpRightFromSquare} size="xs" /></strong><br/>
                      {showDetailedInfo && <span className='text-sm opacity-85'>{product.name}</span>}
                    </a>
                  </td>
                  <td className={`px-4 py-2 border-b whitespace-nowrap overflow-hidden ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>{translateType(product.type)}</td>
                  <td className={`px-4 py-2 border-b whitespace-nowrap overflow-hidden ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>{priceFormatted} kr</td>
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