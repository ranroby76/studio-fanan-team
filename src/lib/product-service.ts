// src/lib/product-service.ts
"use client"; // This service interacts with localStorage, so it's client-side

import type { Product, ProductFormData, DownloadLink } from '@/lib/types';

const PRODUCTS_STORAGE_KEY = 'fananTeamProducts';

const generateId = () => Math.random().toString(36).substr(2, 9);

export const getProducts = (): Product[] => {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(PRODUCTS_STORAGE_KEY);
  try {
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Failed to parse products from localStorage", error);
    return [];
  }
};

export const getProductById = (id: string): Product | undefined => {
  if (typeof window === 'undefined') return undefined;
  const products = getProducts();
  return products.find(p => p.id === id);
};

export const addProduct = (productData: ProductFormData): Product => {
  if (typeof window === 'undefined') throw new Error("localStorage not available");
  const products = getProducts();
  const newProduct: Product = {
    ...productData,
    id: generateId(),
    downloadLinks: productData.downloadLinks.map(link => ({...link, id: generateId()})),
  };
  products.push(newProduct);
  localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
  return newProduct;
};

export const updateProduct = (id: string, productData: ProductFormData): Product | undefined => {
  if (typeof window === 'undefined') throw new Error("localStorage not available");
  const products = getProducts();
  const productIndex = products.findIndex(p => p.id === id);
  if (productIndex === -1) return undefined;

  const updatedProduct: Product = {
    ...products[productIndex],
    ...productData,
    id, // Ensure ID is not overwritten if productData doesn't have it
    downloadLinks: productData.downloadLinks.map(link => ({...link, id: link.id || generateId()})),
  };
  products[productIndex] = updatedProduct;
  localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
  return updatedProduct;
};

export const deleteProduct = (id: string): boolean => {
  if (typeof window === 'undefined') throw new Error("localStorage not available");
  let products = getProducts();
  const initialLength = products.length;
  products = products.filter(p => p.id !== id);
  if (products.length < initialLength) {
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
    return true;
  }
  return false;
};
