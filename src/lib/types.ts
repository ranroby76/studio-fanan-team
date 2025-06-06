// src/lib/types.ts
export interface DownloadLink {
  id: string;
  label: string;
  url: string;
}

export interface Product {
  id: string;
  title: string;
  mainImage: string;
  thumbnails: string[];
  description: string;
  price: number;
  downloadLinks: DownloadLink[];
  demoLimitations: string;
  keywords?: string; // For AI generation reference
}

export type ProductFormData = Omit<Product, 'id'> & { id?: string };
