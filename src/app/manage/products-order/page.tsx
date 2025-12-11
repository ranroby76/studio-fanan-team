// src/app/manage/products-order/page.tsx
import React from 'react';
import { getProducts } from '@/lib/product-service-server';
import ProductOrderClientPage from './ProductOrderClientPage';

export default async function ProductOrderPage() {
  // Fetch all products at once. The client component will handle sorting them into packs.
  const initialProducts = await getProducts() || [];
  
  return (
    <div className="animate-fade-in space-y-4">
      <ProductOrderClientPage initialProducts={initialProducts} />
    </div>
  );
}
