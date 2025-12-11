// src/app/manage/edit/[productId]/page.tsx
import { redirect } from 'next/navigation';

// This page now redirects to the standalone form page.
export default function EditProductPage({ params: { productId } }: { params: { productId: string } }) {
  if (!productId) {
    // Redirect to the products list if no ID is provided.
    redirect('/manage/products');
  }

  // Redirect to the new standalone form page for editing.
  redirect(`/manage/product-form?edit=true&productId=${productId}`);
}
