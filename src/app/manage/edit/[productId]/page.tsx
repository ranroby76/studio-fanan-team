// src/app/manage/edit/[productId]/page.tsx
import ProductForm from '@/components/product/ProductForm';
import { getProductById } from '@/lib/product-service-server';
import { AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Product } from '@/lib/types';

// This is now a server component that fetches data and passes it to the client form component
export default async function EditProductPage({ params: { productId } }: { params: { productId: string } }) {
  const product: Product | undefined = await getProductById(productId);

  if (!product) {
    return (
      <Card className="max-w-md mx-auto mt-10 shadow-lg border-destructive">
        <CardHeader className="bg-destructive text-destructive-foreground">
          <CardTitle className="flex items-center gap-2 font-headline">
            <AlertTriangle /> Error Loading Product
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <p className="text-destructive text-center">
             Product not found. It may have been deleted or the ID is incorrect.
          </p>
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
