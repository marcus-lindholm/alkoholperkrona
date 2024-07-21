"use client"

import React, { useEffect, useState } from 'react';
import Image from "next/image";
import RunScraperButton from './components/RunScraperButton';

export default function Home({ searchParams }: { searchParams: any }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function fetchProducts() {
      console.log('fetching products');
      try {
        const response = await fetch('http://localhost:3000/api/scrapeProducts');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setProducts(data.products);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    }

    if(searchParams.runScraperButton) {
      console.log(searchParams);
      fetchProducts();
    }
  }, [searchParams.runScraperButton]); // Dependency array includes searchParams.runScraperButton to re-run effect when it changes

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <RunScraperButton />
      {/* Optionally render fetched products here */}
    </main>
  );
}