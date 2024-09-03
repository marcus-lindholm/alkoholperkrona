import React, { useState } from 'react';

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
  createdAt: Date;
  updatedAt: Date;
};

const ProductComponent = ({ products, isDarkMode, isBeastMode }: { products: ProductType[], isDarkMode: boolean, isBeastMode: boolean }) => {
  const [visibleCount, setVisibleCount] = useState(20);
  const [filterType, setFilterType] = useState<string | null>(null);
  const [nestedFilter, setNestedFilter] = useState<string | null>(null);
  const [filterOrdervara, setFilterOrdervara] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const translateType = (type: string | null) => {
    let displayType = "";
    if (type == null) {
      return;
    } else if (type.toLowerCase().includes("beer")) {
      displayType += "Öl";
    } else if (type.toLowerCase().includes("wine")) {
      displayType += "Vin";
    } else if (type.toLowerCase().includes("liquor")) {
      displayType += "Sprit";
    } else if (type.toLowerCase().includes("cider")) {
      displayType += "Cider";
    }
    if (type.toLowerCase().includes("ordervara")) {
      displayType += " (Ordervara)";
    }
    return displayType;
  };

  const filteredProducts = products.filter(product => {
    const matchesType = filterType ? product.type && product.type.toLowerCase().includes(filterType.toLowerCase()) : true;
    const matchesNestedFilter = nestedFilter ? product.type && product.type.toLowerCase().includes(nestedFilter.toLowerCase()) : true;
    const matchesOrdervara = filterOrdervara ? true : !product.type?.toLowerCase().includes("ordervara");
    const matchesSearchQuery = isBeastMode ? product.name.toLowerCase().includes(searchQuery.toLowerCase()) || product.brand.toLowerCase().includes(searchQuery.toLowerCase()) || product.type?.toLowerCase().includes(searchQuery.toLowerCase()) : true;
    return matchesType && matchesNestedFilter && matchesOrdervara && matchesSearchQuery;
  });

  const sortedProducts = filteredProducts.sort((a, b) => b.apk - a.apk);

  const loadMore = () => {
    setVisibleCount(prevCount => prevCount + 50);
  };

  return (
    <div className={`overflow-x-auto w-full mt-10 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
      <div className="mb-4 flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center">
        {isBeastMode && (
            <div className="mb-2 sm:mb-0 sm:mr-4">
              <label htmlFor="search" className="mr-2">Sök:</label>
              <input
                id="search"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`px-4 py-2 border rounded ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-black border-gray-200'}`}
              />
            </div>
        )}
        <div className="mb-2 sm:mb-0 sm:mr-4">
          <label htmlFor="filter" className="mr-2">Filter:</label>
          <select
            id="filter"
            value={filterType || ""}
            onChange={(e) => {
              setFilterType(e.target.value || null);
              setNestedFilter(null);
            }}
            className={`px-4 py-2 border rounded ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-black border-gray-200'}`}
          >
            <option value="">Allt</option>
            <option value="beer">Öl</option>
            <option value="wine">Vin</option>
            <option value="liquor">Sprit</option>
            <option value="cider">Cider & blanddrycker</option>
          </select>
        </div>
        {filterType && (
          <div className="mb-2 sm:mb-0 sm:mr-4">
            <select
              id="nestedFilter"
              value={nestedFilter || ""}
              onChange={(e) => setNestedFilter(e.target.value || null)}
              className={`px-4 py-2 border rounded ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-black border-gray-200'}`}
            >
              {filterType === "beer" && (
                <>
                  <option value="">Alla öl</option>
                  <option value="lager">Lager</option>
                  <option value=" ale">Ale</option>
                  <option value="stout">Stout</option>
                  <option value="ipa">IPA</option>
                </>
              )}
              {filterType === "wine" && (
                <>
                  <option value="">Alla viner</option>
                  <option value="rött">Rödvin</option>
                  <option value="vitt">Vitt vin</option>
                  <option value="rosé">Rosévin</option>
                  <option value="mousserande">Mousserande vin</option>
                </>
              )}
              {filterType === "liquor" && (
                <>
                  <option value="">Alla spritdrycker</option>
                  <option value="whiskey">Whiskey</option>
                  <option value="vodka">Vodka</option>
                  <option value="rom">Rom</option>
                  <option value="gin">Gin</option>
                  <option value="punsch">Punch</option>
                </>
              )}
              {filterType === "cider" && (
                <>
                  <option value="">Alla cider</option>
                  <option value="torr">Torr cider</option>
                  <option value="söt">Söt cider</option>
                  <option value="blanddryck">Blanddryck</option>
                </>
              )}
            </select>
          </div>
        )}
        <div className="mb-2 sm:mb-0 sm:mr-4">
          <label htmlFor="ordervara" className="mr-2">Visa ordervaror:</label>
          <div className="relative inline-block w-10 align-middle select-none transition duration-200 ease-in">
            <input
              id="ordervara"
              type="checkbox"
              checked={filterOrdervara}
              onChange={(e) => setFilterOrdervara(e.target.checked)}
              className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
            />
            <label
              htmlFor="ordervara"
              className={`toggle-label block overflow-hidden h-6 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'}`}
            ></label>
          </div>
        </div>
      </div>
      <table className={`min-w-full border ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>
        <thead>
          <tr>
            <th className={`px-4 py-2 border-b ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>Placering</th>
            <th className={`px-4 py-2 border-b ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>APK (ml/kr)</th>
            <th className={`px-4 py-2 border-b ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>Namn</th>
            <th className={`px-4 py-2 border-b ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>Typ</th>
            <th className={`px-4 py-2 border-b ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>Pris</th>
            <th className={`px-4 py-2 border-b ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>Volym</th>
            <th className={`px-4 py-2 border-b ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>Volymprocent</th>
          </tr>
        </thead>
        <tbody>
          {sortedProducts.slice(0, visibleCount).map((product, index) => (
            <tr key={index} className={`hover:${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} ${index % 2 === 0 ? (isDarkMode ? 'bg-gray-700' : 'bg-gray-50') : (isDarkMode ? 'bg-gray-800' : 'bg-white')}`}>
              <td className={`px-4 py-2 border-b ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>{index + 1}</td>
              <td className={`px-4 py-2 border-b ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>{product.apk}</td>
              <td className={`px-4 py-2 border-b ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                <a href={product.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                  <strong>{product.brand}</strong> {product.name}
                </a>
              </td>
              <td className={`px-4 py-2 border-b ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>{translateType(product.type)}</td>
              <td className={`px-4 py-2 border-b ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>{product.price} kr</td>
              <td className={`px-4 py-2 border-b ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>{product.volume} ml</td>
              <td className={`px-4 py-2 border-b ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>{product.alcohol} %</td>
            </tr>
          ))}
        </tbody>
      </table>
      {visibleCount < sortedProducts.length && (
        <div className="text-center my-4">
          <button onClick={loadMore} className={`px-4 py-2 rounded ${isDarkMode ? 'bg-blue-500 text-white' : 'bg-blue-500 text-white'}`}>Visa fler</button>
        </div>
      )}
    </div>
  );
};

export default ProductComponent;