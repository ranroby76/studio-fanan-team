// src/app/manage/page.tsx
import { redirect } from 'next/navigation';

export default function ManagePage() {
  // Redirect to the first item in the management sidebar
  redirect('/manage/products-order');
}
