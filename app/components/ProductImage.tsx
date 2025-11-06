import React from 'react';
import Image from 'next/image';

interface ProductImageProps {
  url: string;
  img: string;
  brand: string;
  id: string;
}

const ProductImage: React.FC<ProductImageProps> = ({ url, img, brand, id }) => {
  return (
    <a href={url} target="_blank" rel="noopener noreferrer">
      <Image 
        src={img} 
        alt={brand} 
        width={96}
        height={96}
        className="object-contain w-24 h-24 rounded" 
        onError={(e) => {
          console.error(`Failed to load image for product: ${brand} (ID: ${id}, URL: ${img})`, e);
        }}
      />
    </a>
  );
};

export default ProductImage;