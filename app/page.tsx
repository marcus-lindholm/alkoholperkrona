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
  const [isDarkMode, setIsDarkMode] = useState(false);

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

  const handleThemeToggle = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <main className={`flex min-h-screen flex-col items-center justify-between p-4 sm:p-8 md:p-16 lg:p-24 ${isDarkMode ? 'dark' : 'light'}`}>
      <div className="absolute top-4 left-4 flex items-center">
        <h1 className="text-2xl font-bold mr-12">APK-listan</h1>
      </div>
      <div className="absolute top-4 right-4 flex items-center">
        <label className="switch">
          <input type="checkbox" checked={isDarkMode} onChange={handleThemeToggle} />
          <span className="slider round"></span>
        </label>
        <span className="ml-2">{isDarkMode ? '🌙' : '☀️'}</span>
      </div>
      {isLoading ? (
        <div className="flex justify-center items-center w-full h-full">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="w-full">
          <ProductComponent products={products} isDarkMode={isDarkMode} />
        </div>
      )}
      <footer className="mt-8 text-center">
      <p>Utvecklad med ❤️ av <a href="https://marcuslindholm.com" target="_blank" rel="noopener noreferrer" className="hover:underline">Marcus Lindholm</a> <span>↗️</span></p>
      </footer>
    </main>
  );
}