// src/app/manage/products-order/page.tsx
import React from 'react';
import { getProducts } from '@/lib/product-service-server';
import ProductOrderClientPage from './ProductOrderClientPage';

export default async function ProductOrderPage() {
  // Fetch initial data on the server.
  // getProducts is now sorted by the order file by default.
  const initialProducts = await getProducts();
  
  return (
    <div className="animate-fade-in space-y-4">
      <ProductOrderClientPage initialProducts={initialProducts} />
    </div>
  );
}
