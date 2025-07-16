// src/app/manage/edit/[productId]/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import ProductForm from '@/components/product/ProductForm';
import type { Product, ProductFormData } from '@/lib/types';
import { getProductById, generateSlug } from '@/lib/product-service';
import { useToast } from '@/hooks/use-toast';
import { Loader2, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function EditProductPage() {
  const params = useParams();
  const productId = typeof params.productId === 'string' ? params.productId : undefined;
  
  const { toast } = useToast();
  const [product, setProduct] = useState<Product | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (productId) {
      try {
        const foundProduct = getProductById(productId);
        if (foundProduct) {
          setProduct(foundProduct);
        } else {
          setError('Product not found. It may have been deleted or the ID is incorrect.');
        }
      } catch (e) {
        console.error("Error fetching product for edit:", e);
        setError('Failed to load product data. Check console for details.');
      } finally {
        setIsLoading(false);
      }
    } else {
      setError('Product ID is missing from the URL.');
      setIsLoading(false);
    }
  }, [productId]);

  const handleGenerateJson = async (data: ProductFormData, jsonString: string) => {
    if (!productId) {
      toast({ title: 'Error', description: 'Product ID is missing.', variant: 'destructive' });
      return;
    }
    try {
      const slug = generateSlug(data.title);
      toast({
        title: 'JSON Generated!',
        description: `Copy the JSON to update the file at src/data/products/${slug}.json`,
      });
    } catch (e) {
      console.error("Error in edit page:", e);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred.',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg text-muted-foreground">Loading product details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="max-w-md mx-auto mt-10 shadow-lg border-destructive">
        <CardHeader className="bg-destructive text-destructive-foreground">
          <CardTitle className="flex items-center gap-2 font-headline">
            <AlertTriangle /> Error Loading Product
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <p className="text-destructive text-center">{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (!product) {
    return <p className="text-center text-destructive">Product data could not be loaded.</p>;
  }

  return (
    <div className="animate-fade-in">
      <ProductForm initialData={product} onSubmit={handleGenerateJson} isEditing={true} />
    </div>
  );
}
