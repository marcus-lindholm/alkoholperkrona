import React from 'react';

interface ProductImageProps {
  url: string;
  img: string;
  brand: string;
  id: string;
}

const ProductImage: React.FC<ProductImageProps> = ({ url, img, brand, id }) => {
  return (
    <a href={url} target="_blank" rel="noopener noreferrer">
      <img 
        src={img} 
        alt={brand} 
        className="object-contain w-24 h-24 rounded" 
        onError={(e) => {
          console.error(`Failed to load image for product: ${brand} (ID: ${id}, URL: ${img})`, e);
        }}
      />
    </a>
  );
};

export default ProductImage;