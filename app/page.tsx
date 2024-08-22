"use client"

import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import Image from "next/image";
import RunScraperButton from './components/RunScraperButton';
import ProductComponent from './components/ProductComponent';
import LoadingSpinner from './components/LoadingSpinner';

export default function Home({ searchParams }: { searchParams: any }) {
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<ProductType[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [fetchAll, setFetchAll] = useState(false);

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

  async function fetchProducts(page: number) {
    const darkModePreference = Cookies.get('darkMode') === 'true';
    setIsDarkMode(darkModePreference);

    console.log('fetching products');
    try {
      const response = await fetch(`/api/products?page=${page}&limit=50`);
      const data = await response.json();
      if (page === 1) {
        setProducts(data.products);
      } else {
        setProducts(prevProducts => [...prevProducts, ...data.products]);
      }
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchProducts(page);
  }, [page]);

  const handleThemeToggle = () => {
    setIsDarkMode(prevMode => {
      const newMode = !prevMode;
      Cookies.set('darkMode', newMode.toString(), { expires: 365 });
      return newMode;
    });
  };

  const loadMore = () => {
    if (page < totalPages) {
      setPage(prevPage => prevPage + 1);
    }
  };

  const fetchEverything = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      setProducts(data.products);
      setTotalPages(1);
    } catch (error) {
      console.error('Error fetching all products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className={`flex min-h-screen flex-col items-center justify-between p-4 sm:p-8 md:p-16 lg:p-24 ${isDarkMode ? 'dark' : 'light'}`}>
      <div className="absolute top-4 left-4 flex items-center">
        <h1 className="text-2xl font-bold mr-12">APKrona.se</h1>
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
        <p>Utvecklad med ❤️ av <a href="https://marcuslindholm.com" target="_blank" rel="noopener noreferrer" className="hover:underline">Marcus Lindholm ↗️</a></p>
        <a href="https://app.swish.nu/1/p/sw/?sw=0736426599&msg=Tack!&edit=msg&src=qr" className="flex items-center justify-center mt-4 mb-4">
          Vill du stödja denna sida? Donera en slant!
          <Image 
            src={isDarkMode ? "/Swish_dark.png" : "/Swish_light.png"} 
            alt="Swish Logo" 
            width={32} 
            height={32} 
            className="ml-2 object-contain"
          />
        </a>
        <label 
          htmlFor="fetchAll"
          className="ml-4 mr-2 text-sm"
          title="Ladda in hela sortimentet (>25000 produkter). Standard är de första 6000. Detta tar längre tid att ladda in."
        >Beast mode</label>
        <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
          <input
            id="fetchAll"
            type="checkbox"
            checked={fetchAll}
            onChange={(e) => {
              setFetchAll(e.target.checked);
              if (e.target.checked) {
                fetchEverything();
              } else {
                setPage(1);
                setProducts([]);
                setIsLoading(true);
                fetchProducts(1);
              }
            }}
            className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
          />
          <label
            htmlFor="fetchAll"
            className={`toggle-label block overflow-hidden h-6 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'}`}
            title="Ladda in hela sortimentet (>25000 produkter). Standard är de första 6000. Detta tar längre tid att ladda in."
          ></label>
        </div>
      </footer>
    </main>
  );
}