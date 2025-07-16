// src/app/manage/edit/[productId]/page.tsx
"use client";

import ProductForm from '@/components/product/ProductForm';
import type { Product } from '@/lib/types';
import { getProductById } from '@/lib/product-service-server';
import { AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useEffect, useState } from 'react';

// This is now a client component that fetches data
export default function EditProductPage({ params: { productId } }: { params: { productId: string } }) {
  const [product, setProduct] = useState<Product | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (productId) {
      getProductById(productId)
        .then(foundProduct => {
          if (foundProduct) {
            setProduct(foundProduct);
          } else {
            setError('Product not found. It may have been deleted or the ID is incorrect.');
          }
        })
        .catch(e => {
          console.error("Error fetching product for edit:", e);
          setError('Failed to load product data. Check console for details.');
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setError('Product ID is missing from the URL.');
      setIsLoading(false);
    }
  }, [productId]);


  if (isLoading) {
    // You can add a proper loading skeleton here if you want
    return <p>Loading product...</p>;
  }

  if (error || !product) {
    return (
      <Card className="max-w-md mx-auto mt-10 shadow-lg border-destructive">
        <CardHeader className="bg-destructive text-destructive-foreground">
          <CardTitle className="flex items-center gap-2 font-headline">
            <AlertTriangle /> Error Loading Product
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <p className="text-destructive text-center">{error || 'Product data could not be loaded.'}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="animate-fade-in">
      <ProductForm initialData={product} isEditing={true} />
    </div>
  );
}
