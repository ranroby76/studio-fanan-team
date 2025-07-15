// src/app/products/[slug]/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { useParams, notFound } from 'next/navigation';
import Image from 'next/image';
import { getProductBySlug } from '@/lib/product-service';
import type { Product } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Loader2, ServerCrash, Download, Info } from 'lucide-react';

export default function ProductPage() {
  const params = useParams();
  const slug = typeof params.slug === 'string' ? params.slug : undefined;
  
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (slug) {
      try {
        const foundProduct = getProductBySlug(slug);
        if (foundProduct) {
          setProduct(foundProduct);
          setSelectedImage(foundProduct.mainImage);
        } else {
          // This will be caught by the notFound() call outside useEffect
        }
      } catch (e) {
        console.error("Failed to load product", e);
        setError("There was an issue loading the product data.");
      } finally {
        setIsLoading(false);
      }
    }
  }, [slug]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg text-muted-foreground">Loading product...</p>
      </div>
    );
  }

  if (error) {
    return (
        <Card className="max-w-md mx-auto mt-10 shadow-lg border-destructive">
            <CardHeader className="bg-destructive/10">
                <CardTitle className="flex items-center gap-3 font-headline text-destructive">
                    <ServerCrash /> An Error Occurred
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
                <p className="text-center">{error}</p>
            </CardContent>
        </Card>
    );
  }

  if (!product) {
    // This function will render the nearest not-found.tsx file
    notFound();
    return null;
  }

  return (
    <div className="container mx-auto px-4 animate-fade-in">
      <div className="flex justify-between items-start mb-4">
          <Badge variant="secondary" className="text-lg py-1 px-4">{product.pack}</Badge>
      </div>
      <h1 className="text-5xl font-bold font-headline text-primary mb-8 text-center">{product.title}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
        <div className="md:col-span-3">
          <Card className="shadow-lg overflow-hidden">
             {selectedImage && (
              <div className="relative w-full aspect-[16/9] bg-muted">
                <Image
                  src={selectedImage}
                  alt={`Main view of ${product.title}`}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 60vw, 800px"
                  priority
                />
              </div>
            )}
            {product.thumbnails && product.thumbnails.length > 0 && (
              <div className="p-2 bg-background border-t">
                <div className="flex gap-2 justify-center">
                  {[product.mainImage, ...product.thumbnails].map((thumb, index) => (
                     <button 
                        key={index} 
                        onClick={() => setSelectedImage(thumb)}
                        className={`relative h-16 w-16 rounded-md overflow-hidden border-2 transition-all duration-200 ${selectedImage === thumb ? 'border-primary shadow-lg' : 'border-transparent hover:border-primary/50'}`}
                      >
                       <Image
                          src={thumb}
                          alt={`Thumbnail ${index + 1}`}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                     </button>
                  ))}
                </div>
              </div>
            )}
          </Card>
        </div>
        <div className="md:col-span-2">
            {/* Additional content will go here in next steps */}
        </div>
      </div>
    </div>
  );
}
