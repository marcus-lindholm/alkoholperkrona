import React, { useState, useEffect } from 'react';

interface Product {
  name: string;
  price: number;
  volume: number;
  alcohol: number;
  url: string;
}

const ProductComponent = ({ products }: { products: Product[] }) => {
  return (
    <div>
      {products.map((product, index) => (
        <div key={index}>
          <h2>{product.name}</h2>
          <p>Price: {product.price}</p>
          <p>Volume: {product.volume}ml</p>
          <p>Alcohol Percentage: {product.alcohol}%</p>
          <a href={product.url}>More Info</a>
        </div>
      ))}
    </div>
  );
};

export default ProductComponent;