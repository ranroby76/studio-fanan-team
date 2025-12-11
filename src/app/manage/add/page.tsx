// src/app/manage/add/page.tsx
"use client";

import ProductForm from '@/components/product/ProductForm';
import type { Pack } from '@/lib/types';
import { useSearchParams } from 'next/navigation';

export default function AddProductPage() {
  const searchParams = useSearchParams();
  const pack = searchParams.get('pack') as Pack | null;

  return (
    <div className="animate-fade-in">
      <ProductForm 
        isEditing={false} 
        preselectedPack={pack || "Mad MIDI Machines Pack"}
      />
    </div>
  );
}
