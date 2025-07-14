// src/app/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Music, PackageSearch, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Separator } from '@/components/ui/separator';
import type { Product } from '@/lib/types';
import { getProducts } from '@/lib/product-service';

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const allProducts = getProducts();
      // To better match the "featured" feel, let's show a subset, e.g., the latest 6
      setProducts(allProducts.slice(0, 6)); 
    } catch (error) {
      console.error("Failed to load products for homepage:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Use product keywords for description, or a slice of the main description
  const getProductDescription = (product: Product): string => {
    if (product.keywords) return product.keywords;
    return product.description.substring(0, 100) + (product.description.length > 100 ? '...' : '');
  };

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
      
      <Link href="/gui-me" aria-label="Learn more about our GUI design philosophy" className="block container mx-auto px-4">
        <section className="relative w-full max-w-3xl mx-auto h-auto overflow-hidden bg-muted/20 rounded-lg shadow-lg">
          <Image
            src="/images/A2.png"
            alt="Site Banner - GUI Me Design Philosophy"
            width={1405}
            height={669}
            className="object-contain w-full h-auto transition-transform duration-500 hover:scale-105"
            data-ai-hint="design abstract"
            priority
          />
        </section>
      </Link>
      
      <div className="container mx-auto px-4">
        <section>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-headline font-semibold text-primary">Featured Products</h2>
            <p className="text-muted-foreground mt-2">Discover our latest and most popular VST instruments and effects.</p>
          </div>
          
          {isLoading ? (
             <div className="flex items-center justify-center h-48">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
             </div>
          ) : products.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-8">
              {products.map((product) => (
                <Link key={product.id} href={`/products/${product.id}`} className="group block">
                  <Card className="overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border-transparent hover:border-primary/50">
                    <div className="aspect-video relative overflow-hidden">
                       <Image
                        src={product.mainImage || "https://placehold.co/600x400.png"}
                        alt={product.title}
                        fill
                        className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                        data-ai-hint="instrument audio"
                      />
                    </div>
                    <CardContent className="p-4 bg-card-foreground/90 text-background">
                      <h3 className="font-headline text-xl text-primary truncate group-hover:text-amber-300 transition-colors">{product.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 h-[2.5em] text-gray-300">
                        {getProductDescription(product)}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
             <Card className="text-center py-12 shadow-lg col-span-1 md:col-span-2">
                <CardContent>
                  <PackageSearch className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
                  <h3 className="text-2xl font-headline text-primary">No Products Yet</h3>
                  <p className="text-muted-foreground mt-2">
                    Check back soon or add a product in the management area.
                  </p>
                </CardContent>
            </Card>
          )}

           <div className="text-center mt-12">
              <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-md hover:shadow-lg">
                  <Link href="/products">
                      View All Products <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
              </Button>
          </div>
        </section>

        <section className="bg-card p-8 rounded-xl shadow-lg mt-16">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1">
              <h2 className="text-3xl font-headline font-semibold text-primary mb-4">Why Choose Fanan Team?</h2>
              <p className="text-foreground/80 mb-3">
                We are dedicated to crafting high-quality, innovative, and affordable VST plugins for musicians and producers of all levels.
              </p>
              <ul className="list-disc list-inside space-y-2 text-foreground/70">
                <li>Unique sound design possibilities.</li>
                <li>Intuitive and user-friendly interfaces.</li>
                <li>Regular updates and dedicated support.</li>
                <li>Great value for exceptional tools.</li>
              </ul>
            </div>
            <div className="flex-1">
              <Image
                src="https://placehold.co/600x400.png"
                alt="Music production"
                width={600}
                height={400}
                className="rounded-lg shadow-md object-cover"
                data-ai-hint="studio music"
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
