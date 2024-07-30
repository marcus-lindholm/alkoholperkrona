"use client"

import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import Image from "next/image";
import RunScraperButton from './components/RunScraperButton';
import ProductComponent from './components/ProductComponent';
import LoadingSpinner from './components/LoadingSpinner';

export default function Home({ searchParams }: { searchParams: any }) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasClicked, setHasClicked] = useState(false);
  const [products, setProducts] = useState<ProductType[]>([]);

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

  /* useEffect(() => {
    async function fetchProducts() {
      console.log('fetching products');
      try {
        const response = await fetch('http://localhost:3000/api/scrapeProducts');
        //const response = await fetch('https://alkoholperkrona-1nml7gj5b-marcusxenons-projects.vercel.app/api/scrapeProducts');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        //setProducts(data.products);
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
  }, [searchParams.runScraperButton]); // Dependency array includes searchParams.runScraperButton to re-run effect when it changes */

  useEffect(() => {
    async function fetchProducts() {
      console.log('fetching products');
      try {
        const response = await fetch('/api/products');
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProducts();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <ProductComponent products={products} />
      )}
    </main>
  );
}