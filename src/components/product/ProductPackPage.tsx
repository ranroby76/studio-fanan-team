// src/components/product/ProductPackPage.tsx
"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getProducts, formatTags } from '@/lib/product-service';
import type { Product, Pack } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, PackageSearch } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProductPackPageProps {
  pack: Pack;
}

const packLogos: Record<Pack, string> = {
  "Pro Pack": "/images/pro pack.png",
  "Mad MIDI Machines Pack": "/images/mad midi machines.png",
  "Free Pack": "/images/free pack.png",
};


export default function ProductPackPage({ pack }: ProductPackPageProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const allProducts = getProducts();
      const filteredProducts = allProducts.filter(p => p.pack === pack);
      setProducts(filteredProducts);
    } catch (error) {
      console.error(`Failed to load products for ${pack}:`, error);
    } finally {
      setIsLoading(false);
    }
  }, [pack]);

  return (
    <div className="container mx-auto px-4 animate-fade-in space-y-8">
      <div className="flex justify-center my-8">
        <div className="w-full max-w-lg h-auto">
          {packLogos[pack] && (
            <Image 
              src={packLogos[pack]} 
              alt={`${pack} Logo`} 
              width={750} 
              height={120} 
              className="object-contain"
              priority
            />
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center min-h-[300px]">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <p className="text-lg text-muted-foreground">Loading {pack} products...</p>
        </div>
      ) : products.length === 0 ? (
        <Card className="text-center py-12 shadow-lg max-w-lg mx-auto">
          <CardHeader>
            <PackageSearch className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
            <CardTitle className="text-2xl font-headline text-primary">No Products Here Yet</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-lg text-foreground/80">
              There are currently no products listed in the {pack}.
            </CardDescription>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map(product => (
            <Card key={product.id} className="group flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden bg-card">
              <Link href={`/products/${product.slug}`} className="flex flex-col h-full">
                <div className="relative overflow-hidden aspect-video bg-muted">
                  {product.mainImage?.url ? (
                    <Image
                      src={product.mainImage.url}
                      alt={product.title}
                      fill
                      className="object-contain w-full h-full p-2 group-hover:scale-105 transition-transform duration-300"
                      data-ai-hint="instrument audio"
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      No Image
                    </div>
                  )}
                </div>
                <CardHeader className="flex-grow p-4">
                  <CardTitle className="text-xl font-bold font-headline text-primary truncate group-hover:text-accent transition-colors">
                    {product.title}
                  </CardTitle>
                  <CardDescription className="text-sm text-foreground/80 h-10 line-clamp-2">
                    {product.shortDescription}
                  </CardDescription>
                </CardHeader>
                <CardFooter className="p-3 border-t bg-muted/30 mt-auto">
                  <p className="text-xs text-muted-foreground text-center truncate w-full">{formatTags(product.formats)}</p>
                </CardFooter>
              </Link>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
