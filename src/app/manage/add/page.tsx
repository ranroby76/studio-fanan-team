// src/app/manage/add/page.tsx
"use client";

import { Suspense } from 'react';
import ProductForm from '@/components/product/ProductForm';
import type { Pack } from '@/lib/types';
import { useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';

function AddProductForm() {
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

export default function AddProductPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-muted-foreground">Loading form...</p>
      </div>
    }>
      <AddProductForm />
    </Suspense>
  );
}
