import { MetadataRoute } from 'next'
import { getProducts } from '@/lib/product-service-server';
 
const BASE_URL = 'https://fananteampro.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticRoutes: MetadataRoute.Sitemap = [
    '/',
    '/gui-me',
    '/packs-list',
    '/how-to-buy',
    '/buy-now',
    '/contact-us',
    '/mad-midi-machine-pack',
    '/max-pack',
    '/free-pack'
  ].map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: route === '/' ? 1.0 : 0.8,
  }));

  // Dynamic product pages
  const products = await getProducts();
  const productRoutes: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${BASE_URL}/products/${product.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

 
  return [
    ...staticRoutes,
    ...productRoutes
  ];
}
