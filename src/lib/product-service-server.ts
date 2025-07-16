// src/lib/product-service-server.ts
'use server';

import type { Product, Pack } from '@/lib/types';
import fs from 'fs/promises';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'src/data');
const PRODUCTS_DIR = path.join(DATA_DIR, 'products');

// --- Data Reading Functions (SERVER ONLY) ---

export const getProductOrder = async (): Promise<string[]> => {
    try {
        const filePath = path.join(DATA_DIR, 'product-order.json');
        const fileContents = await fs.readFile(filePath, 'utf8');
        return JSON.parse(fileContents) as string[];
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            return []; // File doesn't exist, return empty order
        }
        console.error("Could not read product order file:", error);
        return [];
    }
};

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
    return [];
  }
};


export const getProductsForPack = async (pack: Pack): Promise<Product[]> => {
    const [allProducts, productOrder] = await Promise.all([
        getProducts(),
        getProductOrder()
    ]);

    const packProducts = allProducts.filter(p => p.pack === pack);
    
    if (productOrder.length === 0) {
        return packProducts; // No specific order, return as is
    }

    const orderedProducts: Product[] = [];
    const productMap = new Map(packProducts.map(p => [p.slug, p]));
    
    // Add products that are in the order file, in that order
    productOrder.forEach(slug => {
        if (productMap.has(slug)) {
            orderedProducts.push(productMap.get(slug)!);
            productMap.delete(slug);
        }
    });

    // Append any remaining products that weren't in the order file
    const remainingProducts = Array.from(productMap.values());
    
    return [...orderedProducts, ...remainingProducts];
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
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
      console.error(`Could not read product file for slug "${slug}":`, error);
    }
    return undefined;
  }
};
