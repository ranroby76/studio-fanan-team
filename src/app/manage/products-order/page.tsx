// src/app/manage/products-order/page.tsx
import React from 'react';
import { getProductsForPack } from '@/lib/product-service-server';
import ProductOrderClientPage from './ProductOrderClientPage';
import type { Pack } from '@/lib/types';

export default async function ProductOrderPage() {
  // Fetch initial data on the server for all packs.
  const packs: Pack[] = ["Max! Pack", "Mad MIDI Machines Pack", "Free Pack"];
  const allProductsPromises = packs.map(pack => getProductsForPack(pack));
  const allProductsArrays = await Promise.all(allProductsPromises);
  const initialProducts = allProductsArrays.flat();
  
  return (
    <div className="animate-fade-in space-y-4">
      <ProductOrderClientPage initialProducts={initialProducts} />
    </div>
  );
}
