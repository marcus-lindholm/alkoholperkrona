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
  BeverageRanking: { date: Date; ranking: number }[];
};

const ProductComponentMobile = ({ products = [], isDarkMode, isBeastMode, showDetailedInfo }: { products: ProductType[], isDarkMode: boolean, isBeastMode: boolean, showDetailedInfo: boolean }) => {
  const [expandedProduct, setExpandedProduct] = useState<string | null>(null);

  return (
    <div className={`w-full ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-black'}`}>
      {products.map((product, index) => {
        const latestRanking = product.BeverageRanking[0]?.ranking || 'N/A';
        const rankingHistoryData = product.BeverageRanking.map(entry => ({
          date: entry.date.toString(),
          rank: entry.ranking,
          apk: product.apk,
        }));

        return (
          <div key={index} className={`p-4 mb-4 border rounded ${isDarkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-white'}`}>
            <div className="flex justify-between items-center mb-2">
              <a href={product.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                <div className="text-xl">
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
                  <span className="text-2xl font-bold">{product.price.toFixed(2)} kr</span>
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