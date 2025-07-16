// src/lib/types.ts
export interface DownloadLink {
  id: string;
  label: string;
  url: string;
}

export type Pack = "Pro Pack" | "Mad MIDI Machines Pack" | "Free Pack";

export interface Product {
  id: string;
  title: string;
  slug: string;
  pack: Pack;
  mainImage: string;
  thumbnails: string[];
  description: string;
  price: number;
  downloadLinks: DownloadLink[];
  demoLimitations: string;
  keywords?: string; // This field is no longer displayed in the form but kept for potential future use.
  videoUrls?: string[]; // Array of up to 3 YouTube video URLs
}

// ProductFormData is now more aligned with what the form actually collects
export interface ProductFormData {
  id?: string;
  title: string;
  pack: Pack;
  mainImage: string;
  thumbnails: (string | undefined)[]; // Can have empty slots
  description: string;
  price: number;
  winVst3Url: string;
  macVst3Url: string;
  demoLimitations: string;
  videoUrls: (string | undefined)[];
}
