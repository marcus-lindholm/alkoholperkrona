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
  createdAt: Date;
  updatedAt: Date;
};

const ProductComponent = ({ products = [], isDarkMode }: { products: ProductType[], isDarkMode: boolean }) => {
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

  return (
    <div className={`overflow-x-auto w-full mt-10 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
      <table className={`min-w-full border ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>
        <thead>
          <tr>
            <th className={`px-4 py-2 border-b ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>#</th>
            <th className={`px-4 py-2 border-b ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>APK (ml/kr)</th>
            <th className={`px-4 py-2 border-b ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>Namn</th>
            <th className={`px-4 py-2 border-b ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>Typ</th>
            <th className={`px-4 py-2 border-b ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>Pris</th>
            <th className={`px-4 py-2 border-b ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>Volym</th>
            <th className={`px-4 py-2 border-b ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>Volymprocent</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
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
    </div>
  );
};

export default ProductComponent;