// src/app/pro-pack/page.tsx
import ProductPackPage from '@/components/product/ProductPackPage';
import type { Pack } from '@/lib/types';
import { getProductsForPack } from '@/lib/product-service-server';

export default async function ProPackPage() {
  const packName: Pack = "Pro Pack";
  const products = await getProductsForPack(packName);
  return <ProductPackPage pack={packName} initialProducts={products} />;
}
