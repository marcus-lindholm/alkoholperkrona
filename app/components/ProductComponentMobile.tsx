import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown, faArrowUp, faArrowUpRightFromSquare, faStarOfLife, faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons';
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
  rankingHistory: string | null;
  vpk: number;
  createdAt: Date;
  updatedAt: Date;
};

const ProductComponentMobile = ({ products = [], isDarkMode, isBeastMode, showDetailedInfo }: { products: ProductType[], isDarkMode: boolean, isBeastMode: boolean, showDetailedInfo: boolean }) => {
  const [expandedProduct, setExpandedProduct] = useState<string | null>(null);

  return (
    <div className={`w-full mt-10 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-black'}`}>
      {products.map((product, index) => {

        let latestRanking = 'N/A';
        let rankingChange = 'new'; // Default to 'new' if there are less than 4 entries
        let previousRankingBoard = 'N/A';
        let rankingHistoryData: { date: string; rank: number; }[] = [];

        if (product.rankingHistory != null) {
          const rankingEntries = product.rankingHistory.split(',');
          const latestRankingEntry = rankingEntries.pop();
          const previousRankingEntry = rankingEntries.pop();

          if (latestRankingEntry) {
            latestRanking = latestRankingEntry.split(':')[1];
          }

          if (rankingEntries.length < 2) {
            rankingChange = 'new';
          } else if (previousRankingEntry) {
            const previousRanking = previousRankingEntry.split(':')[1];
            if (latestRanking < previousRanking) {
              rankingChange = 'increased';
              previousRankingBoard = previousRanking;
            } else if (latestRanking > previousRanking) {
              rankingChange = 'decreased';
              previousRankingBoard = previousRanking;
            } else {
              rankingChange = 'same';
            }
          }

          rankingHistoryData = rankingEntries.map(entry => {
            const [date, rank] = entry.split(':');
            return { date, rank: parseInt(rank, 10) };
          });
        }
        
        // Format price to always have two decimals
        let priceFormatted = product.price.toString();
        if (priceFormatted.includes('.')) {
          if (priceFormatted.split('.')[1].length === 1) {
            priceFormatted += '0';
          }
        }

        return (
          <div key={index} className={`p-4 mb-4 border rounded ${isDarkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-white'}`}>
            <div className="flex justify-between items-center mb-2">
              <a href={product.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                  <div className="text-xl">
                    {rankingChange === 'increased' && <FontAwesomeIcon icon={faArrowUp} className="text-green-500 mr-2" size="xs" title="Högre placering än tidigare" />}
                    {rankingChange === 'decreased' && <FontAwesomeIcon icon={faArrowDown} className="text-red-500 mr-2" size="xs" title="Lägre placering än tidigare" />}
                    {rankingChange === 'new' && <FontAwesomeIcon icon={faStarOfLife} className="text-yellow-500 mr-2" size="xs" title="Ny produkt på listan" />}
                    {latestRanking}.
                    <span className='ml-2'><strong>{product.brand}</strong><br/></span>
                    {showDetailedInfo && <span className="text-sm opacity-75">{product.name}</span>}
                  </div>
              </a>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                  <div className="mb-4">
                      <span className="text-sm opacity-85">APK</span><br/>
                      <span className="text-medium">{product.apk}</span><br/>
                      <span className="text-sm opacity-85">Volym/kr</span><br/>
                      <span className="text-medium">{product.vpk}</span>
                  </div>
                  <div className="mb-1">
                      <span className="text-2xl font-bold">{priceFormatted} kr</span>
                  </div>
              </div>
              <div className='items-right text-right'>
                <div className="mb-2 whitespace-nowrap">
                  <a href={product.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                    Till produkt <FontAwesomeIcon icon={faArrowUpRightFromSquare} size="xs" />
                  </a>
                </div>
                <div className="mb-2 ml-2">
                    {translateType(product.type)}
                </div>
                <div className="mb-2 ml-12">
                    {product.volume} ml
                </div>
                <div className="mb-2 ml-12">
                    {product.alcohol} %
                </div>
                {isBeastMode && (
                  <button onClick={() => setExpandedProduct(expandedProduct === product.id ? null : product.id)}>
                    <FontAwesomeIcon icon={expandedProduct === product.id ? faChevronUp : faChevronDown} />
                  </button>
                )}
              </div>
            </div>
            {expandedProduct === product.id && (
              <div className={`mt-4 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded`}>
                <RankingHistoryChart data={rankingHistoryData} isDarkMode={isDarkMode} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ProductComponentMobile;