// src/app/manage/add/page.tsx
"use client";

import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, PlusCircle } from 'lucide-react';
import Link from 'next/link';

// This page now acts as an interstitial to avoid complex dependency issues during build.
export default function AddProductInterstitialPage() {
  const searchParams = useSearchParams();
  const pack = searchParams.get('pack') || "Mad MIDI Machines Pack";

  const packFriendlyName = (pack: string) => {
    if (pack.includes('Mad MIDI')) return "Mad MIDI Machines Pack";
    if (pack.includes('Max')) return "Max! Pack";
    if (pack.includes('Free')) return "Free Pack";
    return "Pack";
  }

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
