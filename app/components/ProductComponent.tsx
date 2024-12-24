import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown, faArrowUp, faArrowUpRightFromSquare, faStarOfLife } from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import { Tooltip } from '@nextui-org/react';

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

const ProductComponent = ({ products = [], isDarkMode, isBeastMode }: { products: ProductType[], isDarkMode: boolean, isBeastMode: boolean }) => {
  const translateType = (type: string | null) => {
    let displayType = "";
    if (type == null) {
      return;
    } else if (type.toLowerCase().includes("beer")) {
      displayType += "🍺 "
      displayType += "Öl";
    } else if (type.toLowerCase().includes("wine")) {
      displayType += "🍷 "
      displayType += "Vin";
    } else if (type.toLowerCase().includes("liquor")) {
      displayType += "🥃 "
      displayType += "Sprit";
    } else if (type.toLowerCase().includes("cider")) {
      displayType += "🍏 "
      displayType += "Cider";
    }
    if (type.toLowerCase().includes("ordervara")) {
      displayType += " (Ordervara)";
    }
    return displayType;
  };

  return (
    <div className={`overflow-x-auto w-full mt-10 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
      <table className={`min-w-full border ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>
        <thead>
          <tr>
            <th className={`px-4 py-2 border-b text-left ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>#</th>
            <th className={`px-4 py-2 border-b text-left ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>APK (ml/kr)</th>
            <th className={`px-4 py-2 border-b text-left ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>Namn</th>
            <th className={`px-4 py-2 border-b text-left ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>Typ</th>
            <th className={`px-4 py-2 border-b text-left ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>Pris</th>
            <th className={`px-4 py-2 border-b text-left ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>Volym</th>
            <th className={`px-4 py-2 border-b text-left ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>Volymprocent</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => {
            let latestRanking = 'N/A';
            let rankingChange = 'new'; // Default to 'new' if there are less than 4 entries
            let previousRankingBoard = 'N/A';
          
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
            }

            // Format price to always have two decimals
            let priceFormatted = product.price.toString();
            if (priceFormatted.includes('.')) {
              if (priceFormatted.split('.')[1].length === 1) {
                priceFormatted += '0';
              }
            }

            return(
              <tr key={index} className={`hover:${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} ${index % 2 === 0 ? (isDarkMode ? 'bg-gray-700' : 'bg-gray-50') : (isDarkMode ? 'bg-gray-800' : 'bg-white')}`}>
                <td className={`px-4 py-2 border-b whitespace-nowrap overflow-hidden ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                  {latestRanking}
                  {rankingChange === 'increased' && (
                    <Tooltip content={`Föregående placering: ${previousRankingBoard}`} style={{ backgroundColor: '#333', color: '#fff', fontSize: '12px', borderRadius: '8px', padding: '8px', boxShadow: '0 4px 8px #1f1f21' }}>
                      <FontAwesomeIcon icon={faArrowUp} className="text-green-500 ml-2" size="xs" />
                    </Tooltip>
                  )}
                  {rankingChange === 'decreased' && (
                    <Tooltip content={`Föregående placering: ${previousRankingBoard}`} style={{ backgroundColor: '#333', color: '#fff', fontSize: '12px', borderRadius: '8px', padding: '8px', boxShadow: '0 4px 8px #1f1f21' }}>
                      <FontAwesomeIcon icon={faArrowDown} className="text-red-500 ml-2" size="xs" />
                    </Tooltip>
                  )}
                  {rankingChange === 'new' && (
                    <Tooltip content="Ny produkt på listan" style={{ backgroundColor: '#333', color: '#fff', fontSize: '12px', borderRadius: '8px', padding: '8px', boxShadow: '0 4px 8px #1f1f21' }}>
                      <FontAwesomeIcon icon={faStarOfLife} className="text-yellow-500 ml-2" size="xs" />
                    </Tooltip>
                  )}
                </td>
                <td className={`px-4 py-2 border-b ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>{product.apk}</td>
                <td className={`px-4 py-2 border-b ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                  <a href={product.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                    <strong>{product.brand} <FontAwesomeIcon icon={faArrowUpRightFromSquare} size="xs" /></strong><br/>
                    {isBeastMode && <span className='text-sm opacity-85'>{product.name}</span>}
                  </a>
                </td>
                <td className={`px-4 py-2 border-b whitespace-nowrap overflow-hidden ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>{translateType(product.type)}</td>
                <td className={`px-4 py-2 border-b whitespace-nowrap overflow-hidden ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>{priceFormatted} kr</td>
                <td className={`px-4 py-2 border-b whitespace-nowrap overflow-hidden ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>{product.volume} ml</td>
                <td className={`px-4 py-2 border-b whitespace-nowrap overflow-hidden ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>{product.alcohol} %</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ProductComponent;