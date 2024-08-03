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

const ProductComponent = ({ products }: { products: ProductType[] }) => {
  const [visibleCount, setVisibleCount] = useState(20);

  const sortedProducts = products.sort((a, b) => b.apk - a.apk);

  const translateType = (type: string | null) => {
    if (type == null) {
      return;
    } else if (type.toLowerCase() === "beer") {
      return "Öl";
    } else if (type.toLowerCase() === "wine") {
      return "Vin";
    } else if (type.toLowerCase() === "liquor") {
      return "Sprit";
    } else if (type.toLowerCase() === "cider") {
      return "Cider";
    }
    return type;
  };

  const loadMore = () => {
    setVisibleCount(prevCount => prevCount + 100);
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="px-4 py-2 border-b">Placering</th>
            <th className="px-4 py-2 border-b">APK (ml/kr)</th>
            <th className="px-4 py-2 border-b">Namn</th>
            <th className="px-4 py-2 border-b">Typ</th>
            <th className="px-4 py-2 border-b">Pris</th>
            <th className="px-4 py-2 border-b">Volym</th>
            <th className="px-4 py-2 border-b">Volymprocent</th>
          </tr>
        </thead>
        <tbody>
          {sortedProducts.slice(0, visibleCount).map((product, index) => (
            <tr key={index} className="hover:bg-gray-100">
              <td className="px-4 py-2 border-b">{index + 1}</td>
              <td className="px-4 py-2 border-b">{product.apk}</td>
              <td className="px-4 py-2 border-b">
                <a href={product.url} className="hover:underline"><strong>{product.brand}</strong> {product.name}</a>
              </td>
              <td className="px-4 py-2 border-b">{translateType(product.type)}</td>
              <td className="px-4 py-2 border-b">{product.price} kr</td>
              <td className="px-4 py-2 border-b">{product.volume} ml</td>
              <td className="px-4 py-2 border-b">{product.alcohol} %</td>
            </tr>
          ))}
        </tbody>
      </table>
      {visibleCount < sortedProducts.length && (
        <div className="text-center my-4">
          <button onClick={loadMore} className="px-4 py-2 bg-blue-500 text-white rounded">Visa fler</button>
        </div>
      )}
    </div>
  );
};

export default ProductComponent;