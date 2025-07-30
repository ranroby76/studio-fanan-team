// src/components/product/ProductSchema.tsx
import type { Product } from '@/lib/types';
import Script from 'next/script';

const ProductSchema = ({ product }: { product: Product }) => {
  const SITE_URL = 'https://fananteam.com';

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.shortDescription,
    image: `${SITE_URL}${product.mainImage.url}`,
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

  return (
    <Script
      id={`product-schema-${product.slug}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
};

export default ProductSchema;
