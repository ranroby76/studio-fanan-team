// src/app/manage/add/page.tsx
"use client";

import ProductForm from '@/components/product/ProductForm';
import type { ProductFormData } from '@/lib/types';
import { generateProductsJsonString } from '@/lib/product-service';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

export default function AddProductPage() {
  const { toast } = useToast();
  const router = useRouter();

  const handleGenerateJson = async (data: ProductFormData, jsonString: string) => {
    try {
      // The product form now handles showing the JSON output.
      // We just need to give feedback.
      toast({
        title: 'JSON Generated!',
        description: 'Copy the JSON and add it to src/data/products.json to add the new product.',
      });
      // Optionally, redirect after generation
      // router.push('/manage/products');
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
      <ProductForm onSubmit={handleGenerateJson} isEditing={false} />
    </div>
  );
}
