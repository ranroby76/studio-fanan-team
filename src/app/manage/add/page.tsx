// src/app/manage/add/page.tsx
"use client";

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, PlusCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';

function AddProductContent() {
  const searchParams = useSearchParams();
  const pack = searchParams.get('pack') || "Mad MIDI Machines Pack";

  const packFriendlyName = (pack: string): string => {
    if (pack.includes('Mad MIDI')) return "Mad MIDI Machines Pack";
    if (pack.includes('Max')) return "Max! Pack";
    if (pack.includes('Free')) return "Free Pack";
    return "Pack";
  };

  return (
    <div className="flex justify-center items-center py-10">
      <Card className="w-full max-w-lg text-center animate-fade-in">
        <CardHeader>
          <PlusCircle className="mx-auto h-12 w-12 text-primary mb-4" />
          <CardTitle className="text-2xl font-headline">Add New Product</CardTitle>
          <CardDescription>
            You are adding a new product to the <span className="font-semibold text-accent">{packFriendlyName(pack)}</span>.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-6">Click the button below to proceed to the product creation form.</p>
          <Button asChild size="lg">
            <Link href={`/manage/product-form?pack=${encodeURIComponent(pack)}`}>
              Open Product Form <ArrowRight className="ml-2" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}


export default function AddProductInterstitialPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-muted-foreground">Loading...</p>
      </div>
    }>
      <AddProductContent />
    </Suspense>
  );
}
