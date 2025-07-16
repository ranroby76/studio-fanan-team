// src/app/free-pack/page.tsx
import ProductPackPage from '@/components/product/ProductPackPage';
import type { Pack } from '@/lib/types';

export default function FreePackPage() {
  const packName: Pack = "Free Pack";
  return <ProductPackPage pack={packName} />;
}
