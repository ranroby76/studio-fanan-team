// src/lib/product-service.ts
"use client"; // This service interacts with localStorage, so it's client-side

import type { Product, ProductFormData, DownloadLink, ImageDetails } from '@/lib/types';

const PRODUCTS_STORAGE_KEY = 'fananTeamProducts';
const IMAGE_PREFIX = '/images/products/';

const generateId = () => Math.random().toString(36).substr(2, 9);

const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // remove special chars
    .trim()
    .replace(/\s+/g, '-'); // replace spaces with hyphens
};

export const getProducts = (): Product[] => {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(PRODUCTS_STORAGE_KEY);
  try {
    const products = data ? JSON.parse(data) : [];
    // Ensure all products have a slug for backward compatibility
    return products.map((p: any) => ({ 
      ...p, 
      slug: p.slug || generateSlug(p.title),
      // Backward compatibility for old image string format
      mainImage: typeof p.mainImage === 'string' ? { url: p.mainImage, width: 1600, height: 900 } : p.mainImage,
      thumbnails: Array.isArray(p.thumbnails) ? p.thumbnails.map((t: any) => typeof t === 'string' ? { url: t, width: 400, height: 300 } : t) : [],
    }));
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

export const getProductBySlug = (slug: string): Product | undefined => {
  if (typeof window === 'undefined') return undefined;
  const products = getProducts();
  return products.find(p => p.slug === slug);
};

// Helper to transform form data into the canonical Product structure
const transformFormDataToProduct = (formData: ProductFormData, existingId?: string): Product => {
  const slug = generateSlug(formData.title);
  const id = existingId || formData.id || generateId();

  const downloadLinks: DownloadLink[] = [];
  if (formData.winVst3Url) {
    downloadLinks.push({ id: generateId(), label: `Download ${formData.title} (Windows)`, url: formData.winVst3Url });
  }
  if (formData.macVst3Url) {
     downloadLinks.push({ id: generateId(), label: `Download ${formData.title} (macOS)`, url: formData.macVst3Url });
  }

  const mainImage: ImageDetails = {
    url: `${IMAGE_PREFIX}${formData.mainImage.filename}`,
    width: formData.mainImage.width || 0,
    height: formData.mainImage.height || 0,
  };

  const thumbnails: ImageDetails[] = formData.thumbnails
    .filter(thumb => thumb.filename && thumb.width && thumb.height)
    .map(thumb => ({
      url: `${IMAGE_PREFIX}${thumb.filename}`,
      width: thumb.width || 0,
      height: thumb.height || 0,
    }));

  const product: Product = {
    id,
    slug,
    title: formData.title,
    pack: formData.pack,
    mainImage,
    thumbnails,
    description: formData.description,
    price: formData.price,
    demoLimitations: formData.demoLimitations || '',
    downloadLinks,
    videoUrls: formData.videoUrls?.filter((url): url is string => !!url && url.trim() !== ''),
  };

  return product;
};


export const addProduct = (productData: ProductFormData): Product => {
  if (typeof window === 'undefined') throw new Error("localStorage not available");
  const products = getProducts();
  const newProduct = transformFormDataToProduct(productData);
  
  products.push(newProduct);
  localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
  return newProduct;
};

export const updateProduct = (id: string, productData: ProductFormData): Product | undefined => {
  if (typeof window === 'undefined') throw new Error("localStorage not available");
  const products = getProducts();
  const productIndex = products.findIndex(p => p.id === id);
  if (productIndex === -1) return undefined;

  const updatedProduct = transformFormDataToProduct(productData, id);

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
