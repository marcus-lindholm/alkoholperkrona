"use client"

import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import Image from "next/image";
import RunScraperButton from './components/RunScraperButton';
import ProductComponent from './components/ProductComponent';

export default function Home({ searchParams }: { searchParams: any }) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasClicked, setHasClicked] = useState(false);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function fetchProducts() {
      console.log('fetching products');
      try {
        const response = await fetch('http://localhost:3000/api/scrapeProducts');
        //const response = await fetch('https://alkoholperkrona-1nml7gj5b-marcusxenons-projects.vercel.app/api/scrapeProducts');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setProducts(data.products);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setIsLoading(false);
      }
    }

    if(searchParams.runScraperButton) {
      console.log(searchParams);
      setHasClicked(true);
      fetchProducts();
    }
  }, [searchParams.runScraperButton]); // Dependency array includes searchParams.runScraperButton to re-run effect when it changes

  async function getProducts() {
    
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <RunScraperButton />
      {/* Optionally render fetched products here */}
      {isLoading && hasClicked ? (
        <div>Loading...</div>
      ) : (
        <ProductComponent products={products} />
      )}
    </main>
  );
}