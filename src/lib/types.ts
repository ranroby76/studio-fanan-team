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

export interface GuiMeContent {
  title1?: string;
  text1?: string;
  title2?: string;
  text2?: string;
  title3?: string;
  text3?: string;
}

export type GuiMeContentFormData = GuiMeContent;

export interface FirmLogosData {
  firmLogoUrl?: string;
  proPackLogoUrl?: string;
  madMidiMachinesLogoUrl?: string;
  freePackLogoUrl?: string;
}

export type FirmLogosFormData = FirmLogosData;
