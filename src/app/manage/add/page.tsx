// src/app/manage/add/page.tsx
"use client";

import ProductForm from '@/components/product/ProductForm';
import type { ProductFormData } from '@/lib/types';
import { addProduct } from '@/lib/product-service';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation'; // Corrected import for App Router

export default function AddProductPage() {
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = async (data: ProductFormData) => {
    try {
      addProduct(data);
      toast({
        title: 'Product Added!',
        description: `${data.title} has been successfully added.`,
      });
      router.push('/manage');
    } catch (error) {
      console.error("Error adding product:", error);
      toast({
        title: 'Error',
        description: 'Failed to add product. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="animate-fade-in">
      <ProductForm onSubmit={handleSubmit} isEditing={false} />
    </div>
  );
}
