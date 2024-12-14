import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown, faArrowUp, faArrowUpRightFromSquare, faStarOfLife } from '@fortawesome/free-solid-svg-icons';
import React from 'react';

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
            let rankingChange = 'new'; // Default to 'new' if there's only one entry
            
            if (product.rankingHistory != null) {
              const rankingEntries = product.rankingHistory.split(',');
              const latestRankingEntry = rankingEntries.pop();
              const previousRankingEntry = rankingEntries.pop();
            
              if (latestRankingEntry) {
                latestRanking = latestRankingEntry.split(':')[1];
              }
            
              if (previousRankingEntry) {
                const previousRanking = previousRankingEntry.split(':')[1];
                if (latestRanking < previousRanking) {
                  rankingChange = 'increased';
                } else if (latestRanking > previousRanking) {
                  rankingChange = 'decreased';
                } else {
                  rankingChange = 'same';
                }
              }
            }

            return(
              <tr key={index} className={`hover:${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} ${index % 2 === 0 ? (isDarkMode ? 'bg-gray-700' : 'bg-gray-50') : (isDarkMode ? 'bg-gray-800' : 'bg-white')}`}>
                <td className={`px-4 py-2 border-b whitespace-nowrap overflow-hidden ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                  {latestRanking}
                  {rankingChange === 'increased' && <FontAwesomeIcon icon={faArrowUp} className="text-green-500 ml-2" size="xs" title="Högre placering än tidigare" />}
                  {rankingChange === 'decreased' && <FontAwesomeIcon icon={faArrowDown} className="text-red-500 ml-2" size="xs" title="Lägre placering än tidigare" />}
                  {rankingChange === 'new' && <FontAwesomeIcon icon={faStarOfLife} className="text-yellow-500 ml-2" size="xs" title="Ny produkt på listan" />}
                </td>
                <td className={`px-4 py-2 border-b ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>{product.apk}</td>
                <td className={`px-4 py-2 border-b ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                  <a href={product.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                    <strong>{product.brand} <FontAwesomeIcon icon={faArrowUpRightFromSquare} size="xs" /></strong><br/>
                    {isBeastMode && <span className='text-sm opacity-85'>{product.name}</span>}
                  </a>
                </td>
                <td className={`px-4 py-2 border-b whitespace-nowrap overflow-hidden ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>{translateType(product.type)}</td>
                <td className={`px-4 py-2 border-b whitespace-nowrap overflow-hidden ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>{product.price} kr</td>
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