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

const ProductComponent = ({ products }: { products: ProductType[] }) => {

  const sortedProducts = products.sort((a, b) => b.apk - a.apk);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
          <th className="px-4 py-2 border-b">APK (ml/kr)</th>
            <th className="px-4 py-2 border-b">Namn</th>
            <th className="px-4 py-2 border-b">Pris</th>
            <th className="px-4 py-2 border-b">Volym</th>
            <th className="px-4 py-2 border-b">Volymprocent</th>
          </tr>
        </thead>
        <tbody>
          {sortedProducts.map((product, index) => (
            <tr key={index} className="hover:bg-gray-100">
              <td className="px-4 py-2 border-b">{product.apk}</td>
              <td className="px-4 py-2 border-b">
                <a href={product.url} className="hover:underline"><strong>{product.brand}</strong> {product.name}</a>
              </td>
              <td className="px-4 py-2 border-b">{product.price} kr</td>
              <td className="px-4 py-2 border-b">{product.volume} ml</td>
              <td className="px-4 py-2 border-b">{product.alcohol} %</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductComponent;