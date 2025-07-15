
// src/app/page.tsx
"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, PackageSearch, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Separator } from '@/components/ui/separator';
import { useEffect, useState } from "react";
import type { Product } from "@/lib/types";
import { getProducts } from "@/lib/product-service";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      // "use client" component can't be async, so we use a sync function here.
      const prods = getProducts();
      setProducts(prods);
    } catch (error)      {
      console.error("Error fetching products:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="space-y-12 animate-fade-in">
      
      <section className="relative w-full  mx-auto h-auto overflow-hidden bg-muted/20  shadow-lg">
        <Image
          src="/images/A2.png"
          alt="Site Banner - GUI Me Design Philosophy"
          width={1405}
          height={669}
          className="object-contain w-full h-auto"
          data-ai-hint="design abstract"
          priority
        />
      </section>

      <section className="w-full py-4 bg-gradient-to-r from-green-200 via-yellow-200 to-orange-200">
        <div className="container mx-auto px-4">
           <div className="flex justify-between items-center">
            <Image 
              src="/images/A4.png" 
              alt="Promo graphic" 
              width={160} 
              height={160} 
              className="hidden sm:block object-contain"
              data-ai-hint="decorative graphic" 
            />
            <h2 className="text-3xl font-headline font-bold text-slate-800 tracking-wider uppercase text-center px-4">
              WE BELIEVE EVERY SEASON IS SALES SEASON
            </h2>
            <Image 
              src="/images/A4.png" 
              alt="Promo graphic" 
              width={160} 
              height={160} 
              className="hidden sm:block object-contain"
              data-ai-hint="decorative graphic"
            />
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-headline font-semibold text-primary">Our Plugins Packs</h2>
      </div>
      
      <div className="container mx-auto px-4">
        <div className="space-y-8">
            <Link href="/mad-midi-machine-pack" className="block w-full group">
                <Image
                    src="/images/mad midi machines.png"
                    alt="Mad MIDI Machines Pack"
                    width={1200}
                    height={400}
                    className="w-full h-auto rounded-lg shadow-lg object-contain transition-transform duration-300 group-hover:scale-[1.02]"
                    data-ai-hint="synthesizer abstract"
                />
            </Link>
            <Link href="/pro-pack" className="block w-full group">
                <Image
                    src="/images/pro pack.png"
                    alt="Max Pack"
                    width={1200}
                    height={400}
                    className="w-full h-auto rounded-lg shadow-lg object-contain transition-transform duration-300 group-hover:scale-[1.02]"
                    data-ai-hint="professional audio"
                />
            </Link>
             <Link href="/free-pack" className="block w-full group">
                <Image
                    src="/images/free pack.png"
                    alt="Free Pack"
                    width={1200}
                    height={400}
                    className="w-full h-auto rounded-lg shadow-lg object-contain transition-transform duration-300 group-hover:scale-[1.02]"
                    data-ai-hint="gift box"
                />
            </Link>
        </div>
      </div>
    </div>
  );
}
