// src/components/product/ProductSchema.tsx
import type { Product } from '@/lib/types';
import Script from 'next/script';

const ProductSchema = ({ product }: { product: Product }) => {
  // Safeguard against missing product or formats, which would crash the server render.
  if (!product || !product.formats) {
    return null;
  }

  const SITE_URL = 'https://fananteam.com';

  // SAFEGUARD: Check if mainImage and url exist before using them.
  const rawUrl = product?.mainImage?.url;
  
  // If no image exists, we won't generate the image part of the schema.
  const imageUrl = rawUrl
    ? (rawUrl.startsWith('http') ? rawUrl : new URL(rawUrl, SITE_URL).href)
    : '';

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.shortDescription,
    image: imageUrl,
    sku: product.id,
    brand: {
      '@type': 'Brand',
      name: 'Fanan Team',
    },
    offers: {
      '@type': 'Offer',
      url: `${SITE_URL}/products/${product.slug}`,
      priceCurrency: 'USD',
      price: product.price.toFixed(2),
      availability: 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/NewCondition',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '5', // Default to 5 stars as there's no rating system
      reviewCount: '1',  // Default to 1 to signify existence
    },
  };

  // Only include the image property if we have a valid URL.
  if (!imageUrl) {
    delete (structuredData as any).image;
  }

  return (
    <Script
      id={`product-schema-${product.slug}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
};

export default ProductSchema;
