// src/lib/product-service.ts
import type { Product, ProductFormData, DownloadLink, ImageDetails, Formats } from '@/lib/types';
import { generateSlug } from '@/lib/utils';

// This file contains only client-safe utility functions.
// All file-system related functions have been moved to product-service-server.ts

const IMAGE_PREFIX = '/images/';

const generateId = () => Math.random().toString(36).substr(2, 9);

// --- JSON Generation for Editor (CLIENT-SIDE) ---

const ensureImagePath = (filename: string) => {
    if (!filename) return '';
    // Ensure it's just the filename, not a full path
    const justFilename = filename.split('/').pop() || '';
    if (justFilename.startsWith(IMAGE_PREFIX)) return justFilename;
    return `${IMAGE_PREFIX}${justFilename}`;
};

const stripImagePath = (prefixedUrl: string) => {
    if (!prefixedUrl) return '';
    if (prefixedUrl.startsWith(IMAGE_PREFIX)) return prefixedUrl.substring(IMAGE_PREFIX.length);
    return prefixedUrl;
}

const downloadLinkLabels = [
    "Download Option 1",
    "Download Option 2",
    "Download Stand-Alone (Op. 1)",
    "Download Stand-Alone (Op. 2)"
];

const transformFormDataToProduct = (formData: ProductFormData, existingId?: string): Product => {
  const slug = generateSlug(formData.title);
  const id = existingId || formData.id || generateId();

  const formLinks = [formData.downloadLink1, formData.downloadLink2, formData.downloadLink3, formData.downloadLink4];
  const downloadLinks: DownloadLink[] = [];

  formLinks.forEach((link, index) => {
      if (link.enabled && link.url) {
          downloadLinks.push({
              id: generateId(),
              label: downloadLinkLabels[index],
              url: link.url
          });
      }
  });
  
  const mainImage: ImageDetails = {
    url: ensureImagePath(formData.mainImage.filename),
    width: formData.mainImage.width,
    height: formData.mainImage.height,
  };

  const thumbnails: ImageDetails[] = formData.thumbnails
    .filter(thumb => thumb.filename)
    .map(thumb => ({
      url: ensureImagePath(thumb.filename),
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
    shortDescription: formData.shortDescription,
    formats: formData.formats,
    price: formData.price,
    downloadLinks,
    demoLimitations: formData.demoLimitations || '',
    videoUrls: formData.videoUrls?.filter((url): url is string => !!url && url.trim() !== ''),
  };

  return product;
};

export const transformProductToFormData = (product: Product): ProductFormData => {
  const thumbnails = (product.thumbnails || []).map(t => ({
    filename: stripImagePath(t.url),
    width: t.width,
    height: t.height,
  }));
  while (thumbnails.length < 7) {
    thumbnails.push({ filename: '', width: 0, height: 0 });
  }

  const videoUrls = [...(product.videoUrls || [])];
   while (videoUrls.length < 4) {
    videoUrls.push('');
  }

  const productDownloadLinks = product.downloadLinks || [];
  const findLink = (label: string) => productDownloadLinks.find(l => l.label === label);

  return {
    id: product.id,
    title: product.title,
    pack: product.pack,
    mainImage: {
      filename: stripImagePath(product.mainImage.url),
      width: product.mainImage.width,
      height: product.mainImage.height,
    },
    thumbnails: thumbnails,
    description: (product.description || '').replace(/\\n/g, '\n'),
    shortDescription: product.shortDescription,
    formats: product.formats || { vst: false, vsti: false, win32: false, win64: false, standAlone: false, mac: false, clap: false, ios: false, linux: false },
    price: product.price,
    downloadLink1: { enabled: !!findLink(downloadLinkLabels[0]), url: findLink(downloadLinkLabels[0])?.url || '' },
    downloadLink2: { enabled: !!findLink(downloadLinkLabels[1]), url: findLink(downloadLinkLabels[1])?.url || '' },
    downloadLink3: { enabled: !!findLink(downloadLinkLabels[2]), url: findLink(downloadLinkLabels[2])?.url || '' },
    downloadLink4: { enabled: !!findLink(downloadLinkLabels[3]), url: findLink(downloadLinkLabels[3])?.url || '' },
    demoLimitations: product.demoLimitations,
    videoUrls: videoUrls,
  };
};


export const generateProductJsonString = (formData: ProductFormData, isEditing: boolean): string => {
  const productData = transformFormDataToProduct(formData, isEditing ? formData.id : undefined);
  return JSON.stringify(productData, null, 2);
};


export const formatTags = (formats: Formats | undefined) => {
  if (!formats) return '';
  const parts: string[] = [];
  if (formats.vst) parts.push('VST');
  if (formats.vsti) parts.push('VSTi');
  
  const winFormats: string[] = [];
  if (formats.win32) winFormats.push('32bit');
  if (formats.win64) winFormats.push('64bit');

  if (winFormats.length > 0) {
    parts.push(`Windows ${winFormats.join('/')}`);
  }

  if (formats.mac) parts.push('Mac');
  if (formats.linux) parts.push('Linux');
  if (formats.ios) parts.push('iOS');
  if (formats.clap) parts.push('CLAP');
  if (formats.standAlone) parts.push('Stand-Alone');
  
  return parts.join(' | ');
};
