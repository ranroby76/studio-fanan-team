// src/app/products/packs/[packSlug]/page.tsx
import ProductPackPage from '@/components/product/ProductPackPage';
import type { Pack } from '@/lib/types';
import { getProductsForPack } from '@/lib/product-service-server';
import { notFound } from 'next/navigation';

const slugToPackName = (slug: string): Pack | null => {
  switch (slug) {
    case 'free-pack':
      return 'Free Pack';
    case 'mad-midi-machines-pack':
      return 'Mad MIDI Machines Pack';
    case 'max-pack':
      return 'Max! Pack';
    default:
      return null;
  }
};

export async function generateStaticParams() {
  return [
    { packSlug: 'free-pack' },
    { packSlug: 'mad-midi-machines-pack' },
    { packSlug: 'max-pack' },
  ];
}

export default async function DynamicProductPackPage({ params }: { params: { packSlug: string } }) {
  // Await params to resolve the dynamic segment value
  const resolvedParams = await params;
  const packName = slugToPackName(resolvedParams.packSlug);

  if (!packName) {
    notFound();
  }

  const products = await getProductsForPack(packName);
  return <ProductPackPage pack={packName} initialProducts={products} />;
}
