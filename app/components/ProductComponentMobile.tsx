import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';
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

const ProductComponentMobile = ({ products = [], isDarkMode }: { products: ProductType[], isDarkMode: boolean }) => {
  const translateType = (type: string | null) => {
    let displayType = "";
    if (type == null) {
      return;
    } else if (type.toLowerCase().includes("beer")) {
      displayType += "Öl 🍺";
    } else if (type.toLowerCase().includes("wine")) {
      displayType += "Vin 🍷";
    } else if (type.toLowerCase().includes("liquor")) {
      displayType += "Sprit 🥃";
    } else if (type.toLowerCase().includes("cider")) {
      displayType += "Cider 🍏";
    }
    if (type.toLowerCase().includes("ordervara")) {
      displayType += " (Ordervara)";
    }
    return displayType;
  };

  return (
    <div className={`w-full mt-10 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-black'}`}>
      {products.map((product, index) => (
        <div key={index} className={`p-4 mb-4 border rounded ${isDarkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-white'}`}>
          <div className="flex justify-between items-center mb-2">
            <a href={product.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                <div className="text-xl">
                    {index+1}. <strong>{product.brand}</strong> {product.name}
                </div>
            </a>
            <a href={product.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
              Till produkt <FontAwesomeIcon icon={faArrowUpRightFromSquare} size="xs" />
            </a>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
                <div className="mb-8">
                    <span className="font-medium">APK: </span>{product.apk}
                </div>
                <div className="mb-2">
                    <span className="font-medium"></span><span className="text-2xl">{product.price} kr</span>
                </div>
            </div>
            <div>
                <div className="mb-2 ml-14">
                    <span className="font-medium"></span>{translateType(product.type)}
                </div>
                <div className="mb-2 ml-14">
                    <span className="font-medium"></span>{product.volume} ml
                </div>
                <div className="mb-2 ml-14">
                    <span className="font-medium"></span>{product.alcohol} %
                </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductComponentMobile;