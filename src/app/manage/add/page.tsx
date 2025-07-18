// src/app/manage/add/page.tsx
"use client";

import ProductForm from '@/components/product/ProductForm';
import type { Pack } from '@/lib/types';
import { useSearchParams } from 'next/navigation';

// This page is a simple wrapper around the ProductForm component for adding new products.
// The form's internal logic now handles JSON generation and display.
export default function AddProductPage() {
  const searchParams = useSearchParams();
  const pack = searchParams.get('pack') as Pack | null;

  return (
    <div className="animate-fade-in">
      <ProductForm 
        isEditing={false} 
        preselectedPack={pack || undefined} 
      />
    </div>
  );
}
