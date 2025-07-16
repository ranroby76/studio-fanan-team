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
  mainImage: string; // This will now store the full path, e.g., /images/products/my-image.png
  thumbnails: string[]; // This will also store full paths
  description: string;
  price: number;
  downloadLinks: DownloadLink[];
  demoLimitations: string;
  videoUrls?: string[]; // Array of up to 3 YouTube video URLs
}

// ProductFormData is now more aligned with what the form actually collects
export interface ProductFormData {
  id?: string;
  title: string;
  pack: Pack;
  mainImage: string; // This will store just the filename, e.g., my-image.png
  thumbnails: (string | undefined)[]; // Will also store just filenames
  description: string;
  price: number;
  winVst3Url: string;
  macVst3Url: string;
  demoLimitations: string;
  videoUrls: (string | undefined)[];
}

export interface GuiMeContent {
  title1: string;
  text1: string;
  title2: string;
  text2: string;
  title3: string;
  text3: string;
}

export type GuiMeContentFormData = GuiMeContent;

export interface FirmLogosData {
  firmLogoUrl?: string;
  proPackLogoUrl?: string;
  madMidiMachinesLogoUrl?: string;
  freePackLogoUrl?: string;
}
