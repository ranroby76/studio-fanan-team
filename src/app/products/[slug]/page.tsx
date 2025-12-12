// src/app/products/[slug]/page.tsx
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { getProductBySlug, getProducts } from '@/lib/product-service-server';
import type { Metadata, ResolvingMetadata } from 'next';
import ProductPageContent from '@/components/product/ProductPageContent';
import { Skeleton } from '@/components/ui/skeleton';
import ProductSchema from '@/components/product/ProductSchema';

type Props = {
  params: { slug: string }
}

// This function tells Next.js which routes to pre-build
export async function generateStaticParams() {
  const products = await getProducts();
 
  return products.map((product) => ({
    slug: product.slug,
  }));
}
 
export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // Await params before accessing slug
  const slug = params.slug;
  const product = await getProductBySlug(slug);
 
  if (!product) {
    return {
      title: 'Product Not Found',
    }
  }
 
  const previousImages = (await parent).openGraph?.images || []
 
  return {
    title: product.title,
    description: product.shortDescription,
    openGraph: {
      title: `${product.title} | Fanan Team`,
      description: product.shortDescription,
      images: product.mainImage?.url ? [product.mainImage.url, ...previousImages] : previousImages,
    },
  }
}

// This is the main Server Component for the page.
export default async function ProductPage({ params }: Props) {
  // Await params before accessing slug
  const product = await getProductBySlug(params.slug);

  if (!product) {
    notFound();
  }

  const loadingSpinner = (
    <div className="container mx-auto px-4 animate-fade-in space-y-8">
      <Skeleton className="h-12 w-1/3 mx-auto" />
      <Skeleton className="h-10 w-2/3 mx-auto" />
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3">
          <Skeleton className="w-full aspect-video" />
          <div className="flex gap-2 mt-2 justify-center">
            <Skeleton className="h-20 w-20" />
            <Skeleton className="h-20 w-20" />
            <Skeleton className="h-20 w-20" />
          </div>
        </div>
        <div className="lg:col-span-2">
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    </div>
  );

  return (
    <Suspense fallback={loadingSpinner}>
      <ProductSchema product={product} />
      {/* The product data is fetched on the server and passed as a prop to the client component */}
      <ProductPageContent product={product} />
    </Suspense>
  );
}
