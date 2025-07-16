// src/lib/product-service.ts
import type { Product, ProductFormData, DownloadLink, ImageDetails, Formats } from '@/lib/types';
import allProducts from '@/data/products.json';

const IMAGE_PREFIX = '/images/';

const generateId = () => Math.random().toString(36).substr(2, 9);

const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // remove special chars
    .trim()
    .replace(/\s+/g, '-'); // replace spaces with hyphens
};

// --- Data Reading Functions ---

export const getProducts = (): Product[] => {
  // Now simply returns the imported JSON data.
  // The 'as Product[]' cast is safe because we control the data structure.
  return allProducts as Product[];
};

export const getProductById = (id: string): Product | undefined => {
  const products = getProducts();
  return products.find(p => p.id === id);
};

export const getProductBySlug = (slug: string): Product | undefined => {
  const products = getProducts();
  return products.find(p => p.slug === slug);
};

// --- JSON Generation for Editor ---

// Helper to ensure the image path is correctly prefixed, only if needed.
const ensureImagePath = (filename: string) => {
    if (!filename) return '';
    // Ensure the prefix is not duplicated
    if (filename.startsWith(IMAGE_PREFIX)) {
        return filename;
    }
    return `${IMAGE_PREFIX}${filename}`;
};

const stripImagePath = (prefixedUrl: string) => {
    if (!prefixedUrl) return '';
    if (prefixedUrl.startsWith(IMAGE_PREFIX)) {
        return prefixedUrl.substring(IMAGE_PREFIX.length);
    }
    return prefixedUrl;
}

const downloadLinkLabels = [
    "Download Option 1",
    "Download Option 2",
    "Download Stand-Alone (Op. 1)",
    "Download Stand-Alone (Op. 2)"
];

// Helper to transform form data into the canonical Product structure for JSON generation
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
    width: formData.mainImage.width || 0,
    height: formData.mainImage.height || 0,
  };

  const thumbnails: ImageDetails[] = formData.thumbnails
    .filter(thumb => thumb.filename && thumb.width && thumb.height)
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

// Helper to transform full Product data to form-compatible data for editing
export const transformProductToFormData = (product: Product): ProductFormData => {
  const thumbnails = product.thumbnails.map(t => ({
    filename: stripImagePath(t.url),
    width: t.width,
    height: t.height,
  }));
  while (thumbnails.length < 7) {
    thumbnails.push({ filename: '', width: 0, height: 0 });
  }

  const videoUrls = [...(product.videoUrls || [])];
   while (videoUrls.length < 3) {
    videoUrls.push('');
  }

  const findLink = (label: string) => product.downloadLinks.find(l => l.label === label);

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
    description: product.description.replace(/\\n/g, '\n'),
    shortDescription: product.shortDescription,
    formats: product.formats || { vst: false, vsti: false, win32: false, win64: false },
    price: product.price,
    downloadLink1: { enabled: !!findLink(downloadLinkLabels[0]), url: findLink(downloadLinkLabels[0])?.url || '' },
    downloadLink2: { enabled: !!findLink(downloadLinkLabels[1]), url: findLink(downloadLinkLabels[1])?.url || '' },
    downloadLink3: { enabled: !!findLink(downloadLinkLabels[2]), url: findLink(downloadLinkLabels[2])?.url || '' },
    downloadLink4: { enabled: !!findLink(downloadLinkLabels[3]), url: findLink(downloadLinkLabels[3])?.url || '' },
    demoLimitations: product.demoLimitations,
    videoUrls: videoUrls,
  };
};

/**
 * Generates a JSON string representing the updated list of all products.
 * This string is intended to be copied by the user into the `products.json` file.
 */
export const generateProductsJsonString = (formData: ProductFormData, isEditing: boolean): string => {
  const currentProducts = getProducts();
  const newProduct = transformFormDataToProduct(formData, isEditing ? formData.id : undefined);
  
  let updatedProducts: Product[];

  if (isEditing) {
    // Find and replace the existing product
    const productIndex = currentProducts.findIndex(p => p.id === newProduct.id);
    if (productIndex > -1) {
      currentProducts[productIndex] = newProduct;
      updatedProducts = currentProducts;
    } else {
      // If for some reason it's not found, add it.
      updatedProducts = [...currentProducts, newProduct];
    }
  } else {
    // Add the new product
    updatedProducts = [...currentProducts, newProduct];
  }

  return JSON.stringify(updatedProducts, null, 2);
};

/**
 * Generates a JSON string for deleting a product.
 * The user copies this new array into the products.json file.
 */
export const generateJsonForDelete = (id: string): string => {
  const currentProducts = getProducts();
  const updatedProducts = currentProducts.filter(p => p.id !== id);
  return JSON.stringify(updatedProducts, null, 2);
};

// Helper to format the tags
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
  
  return parts.join(' | ');
};
