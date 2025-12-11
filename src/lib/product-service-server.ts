// src/lib/product-service-server.ts
'use server';

import type { Product, Pack } from '@/lib/types';
import fs from 'fs/promises';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'src/data');
const PRODUCTS_DIR = path.join(DATA_DIR, 'products');

const getOrderFilenameForPack = (pack: Pack): string => {
    switch (pack) {
        case "Max! Pack":
            return 'product-order-max-pack.json';
        case "Mad MIDI Machines Pack":
            return 'product-order-mad-midi-machines-pack.json';
        case "Free Pack":
            return 'product-order-free-pack.json';
    }
};

// --- Data Reading Functions (SERVER ONLY) ---

export const getProductOrderForPack = async (pack: Pack): Promise<string[]> => {
    try {
        const filename = getOrderFilenameForPack(pack);
        const filePath = path.join(DATA_DIR, filename);
        const fileContents = await fs.readFile(filePath, 'utf8');
        return JSON.parse(fileContents) as string[];
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            return []; // File doesn't exist, return empty order
        }
        console.error(`Could not read product order file for ${pack}:`, error);
        return [];
    }
};

const getAllProductsUnordered = async (): Promise<Product[]> => {
    try {
        const filenames = await fs.readdir(PRODUCTS_DIR);
        const productPromises = filenames
            .filter(file => file.endsWith('.json'))
            .map(async (filename) => {
                const filePath = path.join(PRODUCTS_DIR, filename);
                try {
                    const fileContents = await fs.readFile(filePath, 'utf8');
                    const product = JSON.parse(fileContents) as Product;
                    // Basic validation to ensure essential fields exist
                    if (product && product.slug && product.title) {
                        return product;
                    }
                    console.warn(`Skipping malformed product file: ${filename}`);
                    return null;
                } catch (parseError) {
                    console.error(`Error parsing ${filename}:`, parseError);
                    return null; // Skip this file if it's invalid JSON
                }
            });

        const products = (await Promise.all(productPromises)).filter((p): p is Product => p !== null);
        return products;
    } catch (error) {
        console.error("Could not read products directory:", error);
        return [];
    }
};


export const getProducts = async (): Promise<Product[]> => {
    // This function now just gets all products. Sorting happens in getProductsForPack or other callers.
    return await getAllProductsUnordered();
}

const sortProductsByOrder = (products: Product[], order: string[]): Product[] => {
    if (order.length === 0) {
        return products;
    }

    const orderedProducts: Product[] = [];
    const productMap = new Map(products.map(p => [p.slug, p]));
    
    order.forEach(slug => {
        if (productMap.has(slug)) {
            orderedProducts.push(productMap.get(slug)!);
            productMap.delete(slug);
        }
    });

    const remainingProducts = Array.from(productMap.values());
    
    return [...orderedProducts, ...remainingProducts];
}

export const getProductsForPack = async (pack: Pack): Promise<Product[]> => {
    const [allProducts, productOrder] = await Promise.all([
        getAllProductsUnordered(),
        getProductOrderForPack(pack)
    ]);
    
    const packProducts = allProducts.filter(p => p.pack === pack);
    return sortProductsByOrder(packProducts, productOrder);
}

export const getProductById = async (id: string): Promise<Product | undefined> => {
  const products = await getAllProductsUnordered();
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
