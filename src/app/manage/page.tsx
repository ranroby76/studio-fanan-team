// src/app/manage/page.tsx
import { redirect } from 'next/navigation';

export default function ManagePage() {
  // Redirect to the first item in the management sidebar
  redirect('/manage/gui-me-editor');
  // Return null or a loading state if needed, but redirect should handle it.
  // return null; 
}
