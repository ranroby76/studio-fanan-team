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

// Helper to transform form data into the canonical Product structure for JSON generation
const transformFormDataToProduct = (formData: ProductFormData, existingId?: string): Product => {
  const slug = generateSlug(formData.title);
  const id = existingId || formData.id || generateId();

  const downloadLinks: DownloadLink[] = [];
  if (formData.winVst3Url) {
    downloadLinks.push({ id: generateId(), label: `Download (Windows)`, url: formData.winVst3Url });
  }
   if (formData.winVst3Url_alt) {
    downloadLinks.push({ id: generateId(), label: `Download (Windows) Alternative`, url: formData.winVst3Url_alt });
  }
  if (formData.macVst3Url) {
     downloadLinks.push({ id: generateId(), label: `Download (macOS)`, url: formData.macVst3Url });
  }
  if (formData.macVst3Url_alt) {
     downloadLinks.push({ id: generateId(), label: `Download (macOS) Alternative`, url: formData.macVst3Url_alt });
  }

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
    winVst3Url: product.downloadLinks.find(l => l.label.includes('Windows') && !l.label.includes('Alternative'))?.url || '',
    macVst3Url: product.downloadLinks.find(l => l.label.includes('macOS') && !l.label.includes('Alternative'))?.url || '',
    winVst3Url_alt: product.downloadLinks.find(l => l.label.includes('Windows') && l.label.includes('Alternative'))?.url || '',
    macVst3Url_alt: product.downloadLinks.find(l => l.label.includes('macOS') && l.label.includes('Alternative'))?.url || '',
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
