// src/app/manage/edit/[productId]/page.tsx
import ProductForm from '@/components/product/ProductForm';
import type { Product } from '@/lib/types';
import { getProductById } from '@/lib/product-service-server';
import { AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// This is a server component that fetches data
export default async function EditProductPage({ params }: { params: { productId: string } }) {
  const productId = params.productId;
  let product: Product | undefined;
  let error: string | null = null;

  if (productId) {
    try {
      const foundProduct = await getProductById(productId);
      if (foundProduct) {
        product = foundProduct;
      } else {
        error = 'Product not found. It may have been deleted or the ID is incorrect.';
      }
    } catch (e) {
      console.error("Error fetching product for edit:", e);
      error = 'Failed to load product data. Check console for details.';
    }
  } else {
    error = 'Product ID is missing from the URL.';
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
