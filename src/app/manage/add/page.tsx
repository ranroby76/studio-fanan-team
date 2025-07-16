// src/app/manage/add/page.tsx
"use client";

import ProductForm from '@/components/product/ProductForm';
import type { ProductFormData, Pack } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { useRouter, useSearchParams } from 'next/navigation';

export default function AddProductPage() {
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const pack = searchParams.get('pack') as Pack | null;

  const handleGenerateJson = async (data: ProductFormData, jsonString: string) => {
    try {
      toast({
        title: 'JSON Generated!',
        description: 'Copy the JSON and add it to src/data/products.json to add the new product.',
      });
    } catch (error) {
      console.error("Error in add page:", error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="animate-fade-in">
      <ProductForm 
        onSubmit={handleGenerateJson} 
        isEditing={false} 
        preselectedPack={pack || undefined} 
      />
    </div>
  );
}
