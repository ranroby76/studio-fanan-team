// src/components/product/ProductDisplayClient.tsx
"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';
import type { Product } from '@/lib/types';
import { getProductById } from '@/lib/product-service';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DownloadCloud, AlertTriangle, DollarSign, ImageIcon, CheckCircle } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

interface ProductDisplayClientProps {
  productId: string;
}

export default function ProductDisplayClient({ productId }: ProductDisplayClientProps) {
  const [product, setProduct] = useState<Product | null | undefined>(undefined); // undefined for loading, null for not found

  useEffect(() => {
    if (productId) {
      const fetchedProduct = getProductById(productId);
      setProduct(fetchedProduct || null);
    }
  }, [productId]);

  if (product === undefined) {
    return <div className="text-center py-10">Loading product details...</div>;
  }

  if (product === null) {
    return (
      <Card className="text-center py-10 shadow-lg">
        <CardHeader>
          <ImageIcon className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
          <CardTitle className="text-3xl font-headline text-destructive">Product Not Found</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg text-foreground/80">Sorry, we couldn't find the product you're looking for.</p>
          <Button asChild className="mt-6 bg-primary hover:bg-primary/90 text-primary-foreground">
            <Link href="/products">Browse Other Products</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="animate-fade-in">
      <Card className="overflow-hidden shadow-2xl">
        <div className="relative w-full h-64 md:h-96 bg-muted">
          <Image
            src={product.mainImage || "https://placehold.co/1200x600.png?text=Main+Image"}
            alt={product.title}
            layout="fill"
            objectFit="cover"
            className="transition-transform duration-500 hover:scale-105"
            data-ai-hint="synthesizer keyboard"
          />
        </div>
        
        <CardHeader className="pt-6">
          <CardTitle className="text-4xl md:text-5xl font-headline text-primary mb-2">{product.title}</CardTitle>
          <div className="flex items-center text-2xl font-semibold text-accent mb-4">
            <DollarSign className="h-7 w-7 mr-2" />
            <span>{product.price.toFixed(2)}</span>
          </div>
        </CardHeader>

        <CardContent className="space-y-8">
          {product.thumbnails && product.thumbnails.length > 0 && (
            <section>
              <h2 className="text-xl font-headline font-semibold text-primary mb-3">Screenshots</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {product.thumbnails.map((thumbUrl, index) => (
                  <div key={index} className="aspect-square relative rounded-md overflow-hidden shadow-md border hover:opacity-80 transition-opacity">
                    <Image
                      src={thumbUrl || `https://placehold.co/200x200.png?text=Thumb+${index + 1}`}
                      alt={`${product.title} thumbnail ${index + 1}`}
                      layout="fill"
                      objectFit="cover"
                      data-ai-hint="software ui"
                    />
                  </div>
                ))}
              </div>
            </section>
          )}
          
          <Separator />

          <section>
            <h2 className="text-2xl font-headline font-semibold text-primary mb-3">Description</h2>
            <div className="prose prose-lg max-w-none text-foreground/80 font-body" dangerouslySetInnerHTML={{ __html: product.description.replace(/\n/g, '<br />') }} />
          </section>

          <Separator />
          
          <section>
            <h2 className="text-2xl font-headline font-semibold text-primary mb-4">Download</h2>
            {product.downloadLinks && product.downloadLinks.length > 0 ? (
              <div className="space-y-3">
                {product.downloadLinks.map((link) => (
                  <Button key={link.id || link.url} asChild size="lg" className="w-full sm:w-auto sm:mr-3 bg-accent hover:bg-accent/90 text-accent-foreground">
                    <a href={link.url} target="_blank" rel="noopener noreferrer">
                      <DownloadCloud className="mr-2 h-5 w-5" /> {link.label}
                    </a>
                  </Button>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No download links available for this product yet.</p>
            )}
          </section>
          
          <Separator />

          <section>
            <h2 className="text-2xl font-headline font-semibold text-primary mb-3 flex items-center">
              <AlertTriangle className="mr-2 h-6 w-6 text-amber-500" /> Demo Limitations
            </h2>
            <p className="text-foreground/80 font-body">{product.demoLimitations}</p>
          </section>
          
          <Separator />

          <div className="text-center py-6">
             <Button size="xl" asChild className="bg-primary hover:bg-primary/80 text-primary-foreground text-lg px-10 py-4 rounded-lg shadow-lg transform hover:scale-105 transition-transform">
                <Link href="/buy-now">
                    <CheckCircle className="mr-3 h-6 w-6"/> Purchase Full Version
                </Link>
             </Button>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}
