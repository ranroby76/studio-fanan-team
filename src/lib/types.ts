// src/lib/types.ts

export interface Formats {
  vst: boolean;
  vsti: boolean;
  win32: boolean;
  win64: boolean;
}

export interface DownloadLink {
  id: string;
  label: string;
  url: string;
}

export type Pack = "Pro Pack" | "Mad MIDI Machines Pack" | "Free Pack";

export interface ImageDetails {
  url: string;
  width: number;
  height: number;
}

export interface ImageFormData {
  filename: string;
  width?: number;
  height?: number;
}


export interface Product {
  id: string;
  title: string;
  slug: string;
  pack: Pack;
  mainImage: ImageDetails;
  thumbnails: ImageDetails[];
  description: string;
  shortDescription: string;
  formats: Formats;
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
  mainImage: ImageFormData;
  thumbnails: ImageFormData[];
  description: string;
  shortDescription: string;
  formats: Formats;
  price: number;
  winVst3Url: string;
  winVst3Url_alt?: string;
  demoLimitations?: string;
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
