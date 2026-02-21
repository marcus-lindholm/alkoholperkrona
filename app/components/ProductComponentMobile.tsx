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
  vpk: number;
  createdAt: Date;
  updatedAt: Date;
  img: string;
  BeverageRanking: { date: Date; ranking: number; apk: number }[];
};

const ProductComponentMobile = ({ products = [], isDarkMode, isBeastMode, showDetailedInfo }: { products: ProductType[], isDarkMode: boolean, isBeastMode: boolean, showDetailedInfo: boolean }) => {
  const [expandedProduct, setExpandedProduct] = useState<string | null>(null);

  return (
    <div className={`w-full overflow-x-hidden ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-black'}`}>
      {products.map((product, index) => {
          let latestRanking = 'N/A';
          let rankingChange = '';
          let previousRankingBoard = 'N/A';

          if (product.BeverageRanking.length > 0) {
            const sortedRankings = [...product.BeverageRanking].sort(
              (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
            );
            const latestRankingEntry = sortedRankings[0];
            const previousRankingEntry = sortedRankings[1];

            const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format

            if (latestRankingEntry) {
              latestRanking = latestRankingEntry.ranking.toString();

              // Check if the latest entry is from today
              if (
                latestRankingEntry &&
                latestRankingEntry.date &&
                new Date(latestRankingEntry.date).toISOString().split('T')[0] === today &&
                previousRankingEntry
              ) {
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
          }
        // Check if the product is new (created within the last week)
        const isNewProduct = new Date(product.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

        const priceFormatted = Number.isInteger(product.price) ? product.price.toString() : product.price.toFixed(2);

        const rankingHistoryData = product.BeverageRanking.map(entry => ({
          date: entry.date.toString(),
          rank: entry.ranking,
          apk: entry.apk,
        }));

        return (
          <div key={index} className={`p-4 mb-4 border rounded overflow-hidden ${isDarkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-white'}`}>
            <div className="flex justify-between items-center mb-2">
              <a href={product.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                <div className="text-xl">
                  {rankingChange === 'increased' && <FontAwesomeIcon icon={faArrowUp} className="text-green-500 mr-2" size="xs" title="Högre placering än tidigare" />}
                  {rankingChange === 'decreased' && <FontAwesomeIcon icon={faArrowDown} className="text-red-500 mr-2" size="xs" title="Lägre placering än tidigare" />}
                  {isNewProduct && <FontAwesomeIcon icon={faStarOfLife} className="text-yellow-500 mr-2" size="xs" title="Ny produkt på listan" />}
                  {latestRanking}.
                  <span className='ml-2'><strong>{product.brand}</strong><br/></span>
                  {showDetailedInfo && <span className="text-sm opacity-75">{product.name}</span>}
                </div>
              </a>
            </div>
            <div className="grid grid-cols-2 gap-1">
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
                <div className="mb-2 ml-2">
                  {product.volume} ml
                </div>
                <div className="mb-2 ml-2">
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
              <div className={`mt-4 overflow-hidden ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded`}>
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