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
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="space-y-12 animate-fade-in">
      <div className="bg-primary/10">
        <div className="container mx-auto px-4 text-center space-y-3 py-3 rounded-lg shadow-sm">
          <Separator className="bg-border/50" />
          <p className="text-foreground/80">
            New to Fanan Team? Please, always read the{" "}
            <Link href="/how-to-buy" className="text-accent hover:underline font-semibold">
              &quot;how to buy?&quot;
            </Link>{" "}
            instructions before purchasing.
          </p>
          <Separator className="bg-border/50" />
          <p className="text-foreground/80 font-medium">
            New folks, please, Always try the demo first before purchasing. Never buy before first testing a demo on your system.
          </p>
        </div>
      </div>
      
      <section className="relative w-full max-w-3xl mx-auto h-auto overflow-hidden bg-muted/20 rounded-lg shadow-lg">
        <Image
          src="/images/A2.png"
          alt="Site Banner - GUI Me Design Philosophy"
          width={1405}
          height={669}
          className="object-contain w-full h-auto transition-transform duration-500"
          data-ai-hint="design abstract"
          priority
        />
      </section>

      <section className="w-full py-8 bg-gradient-to-r from-green-200 via-yellow-200 to-orange-200">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-headline font-bold text-slate-800 tracking-wider uppercase">
            WE BELIEVE EVERY SEASON IS SALES SEASON
          </h2>
        </div>
      </section>
      
      <div className="container mx-auto px-4">
        <section className="bg-card p-8 rounded-xl shadow-lg mt-8">
           <h2 className="text-3xl font-headline font-semibold text-primary mb-6 text-center">Featured Products</h2>
           {isLoading ? (
             <div className="flex justify-center items-center h-64">
               <Loader2 className="h-12 w-12 animate-spin text-primary" />
             </div>
           ) : products.length === 0 ? (
            <div className="text-center py-10">
              <PackageSearch className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No featured products to display yet.</p>
            </div>
           ) : (
             <div className="grid md:grid-cols-2 gap-8">
               {products.map((product) => (
                 <Link key={product.id} href={`/products/${product.id}`} className="group block">
                   <Card className="overflow-hidden h-full transform transition-transform duration-300 group-hover:-translate-y-1 group-hover:shadow-xl">
                      <div className="relative aspect-video">
                         <Image
                           src={product.mainImage || "https://placehold.co/600x400.png"}
                           alt={product.title}
                           fill
                           className="object-cover transition-transform duration-300 group-hover:scale-105"
                           data-ai-hint="instrument audio"
                         />
                      </div>
                      <div className="p-4 bg-card-foreground text-background">
                         <CardTitle className="font-headline text-lg truncate text-primary group-hover:text-accent transition-colors">{product.title}</CardTitle>
                         <CardDescription className="text-sm text-muted-foreground line-clamp-2 mt-1">{product.description}</CardDescription>
                      </div>
                   </Card>
                 </Link>
               ))}
             </div>
           )}
        </section>
      </div>
    </div>
  );
}
