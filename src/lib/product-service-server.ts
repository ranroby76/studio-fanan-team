// src/lib/product-service-server.ts
'use server';

import type { Product, Pack } from '@/lib/types';
import fs from 'fs/promises';
import path from 'path';

const PRODUCTS_DIR = path.join(process.cwd(), 'src/data/products');

// --- Data Reading Functions (SERVER ONLY) ---

export const getProducts = async (): Promise<Product[]> => {
  try {
    const filenames = await fs.readdir(PRODUCTS_DIR);
    const products = await Promise.all(
      filenames
        .filter(file => file.endsWith('.json'))
        .map(async filename => {
          const filePath = path.join(PRODUCTS_DIR, filename);
          const fileContents = await fs.readFile(filePath, 'utf8');
          const product = JSON.parse(fileContents) as Product;
          return product;
        })
    );
    return products;
  } catch (error) {
    console.error("Could not read products directory:", error);
    // In a server environment, it might be better to throw the error
    // or return an empty array depending on desired behavior.
    return [];
  }
};


export const getProductsForPack = async (pack: Pack): Promise<Product[]> => {
    const allProducts = await getProducts();
    return allProducts.filter(p => p.pack === pack);
}

export const getProductById = async (id: string): Promise<Product | undefined> => {
  const products = await getProducts();
  return products.find(p => p.id === id);
};

export const getProductBySlug = async (slug: string): Promise<Product | undefined> => {
  try {
    const filePath = path.join(PRODUCTS_DIR, `${slug}.json`);
    const fileContents = await fs.readFile(filePath, 'utf8');
    return JSON.parse(fileContents) as Product;
  } catch (error) {
    // If file doesn't exist, this will throw. The page can handle it with a 404.
    // We log other errors for debugging.
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
      console.error(`Could not read product file for slug "${slug}":`, error);
    }
    return undefined;
  }
};
