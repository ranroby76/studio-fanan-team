// src/app/pro-pack/page.tsx
import ProductPackPage from '@/components/product/ProductPackPage';
import type { Pack } from '@/lib/types';

export default function ProPackPage() {
  const packName: Pack = "Pro Pack";
  return <ProductPackPage pack={packName} />;
}
