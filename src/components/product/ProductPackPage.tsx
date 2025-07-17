// src/components/product/ProductPackPage.tsx
"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { formatTags } from '@/lib/product-service';
import type { Product, Pack } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, PackageSearch } from 'lucide-react';

interface ProductPackPageProps {
  pack: Pack;
  initialProducts: Product[];
}

const packLogos: Record<Pack, string> = {
  "Max! Pack": "/images/pro pack.png",
  "Mad MIDI Machines Pack": "/images/mad midi machines.png",
  "Free Pack": "/images/free pack.png",
};


export default function ProductPackPage({ pack, initialProducts }: ProductPackPageProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [isLoading, setIsLoading] = useState(false); // Initial data is now passed in

  useEffect(() => {
    setProducts(initialProducts);
  }, [initialProducts]);


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
        <div className="columns-1 md:columns-2 gap-8 space-y-8">
          {products.map(product => (
            <Card key={product.id} className="group flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden bg-card break-inside-avoid">
              <Link href={`/products/${product.slug}`} target="_blank" rel="noopener noreferrer" className="flex flex-col">
                <div className="relative overflow-hidden bg-muted">
                  {product.mainImage?.url && product.mainImage.width && product.mainImage.height ? (
                    <Image
                      src={product.mainImage.url}
                      alt={product.title}
                      width={product.mainImage.width}
                      height={product.mainImage.height}
                      className="object-contain w-full h-auto p-2 group-hover:scale-105 transition-transform duration-300"
                      data-ai-hint="instrument audio"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  ) : (
                    <div className="w-full h-48 flex items-center justify-center text-muted-foreground">
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
                  <p className="text-base text-muted-foreground text-center truncate w-full">{formatTags(product.formats)}</p>
                </CardFooter>
              </Link>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
