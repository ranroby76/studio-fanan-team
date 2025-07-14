// src/app/products/[productId]/page.tsx

import ProductDisplayClient from '@/components/product/ProductDisplayClient';
import type { Metadata } from 'next';
// Note: getProductById would be a server-side fetch in a real DB scenario.
// Here, as localStorage is client-side, metadata generation is limited.
// For simplicity, we'll use a generic title or rely on client-side updates if possible.

type Props = {
  params: { productId: string };
};

// This function is for server-side metadata generation.
// It won't work directly with localStorage based products.
// In a real app with a DB, you'd fetch product details here.
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const productId = params.productId;
  // const product = await getProductByIdFromServer(productId); // Fictional server-side fetch
  // For now, let's assume a generic title format
  // A client component could update document.title if needed.
  return {
    title: `Product Details | Fanan Team Hub`, // Placeholder, real name would be better
    description: `Details for product ${productId}.`,
  };
}

export default function ProductPage({ params }: Props) {
  return (
    <div className="container mx-auto px-4">
      <ProductDisplayClient productId={params.productId} />
    </div>
  );
}
