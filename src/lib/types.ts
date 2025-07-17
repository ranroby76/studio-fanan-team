// src/lib/types.ts

export interface Formats {
  vst: boolean;
  vsti: boolean;
  win32: boolean;
  win64: boolean;
  standAlone: boolean;
}

export interface DownloadLink {
  id: string;
  label: string;
  url: string;
}

export type Pack = "Max! Pack" | "Mad MIDI Machines Pack" | "Free Pack";

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
  videoUrls?: string[]; // Array of up to 4 YouTube video URLs
}

export interface ProductFormDownloadLink {
    enabled: boolean;
    url: string;
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
  downloadLink1: ProductFormDownloadLink;
  downloadLink2: ProductFormDownloadLink;
  downloadLink3: ProductFormDownloadLink;
  downloadLink4: ProductFormDownloadLink;
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
