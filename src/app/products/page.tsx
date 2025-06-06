// src/app/products/page.tsx
"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PackageSearch, Loader2, ArrowRight, Music } from 'lucide-react';
import type { Product } from '@/lib/types';
import { getProducts } from '@/lib/product-service';
import { useToast } from '@/hooks/use-toast';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    setIsLoading(true);
    try {
      const prods = getProducts();
      setProducts(prods);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast({
        title: "Error",
        description: "Could not fetch products.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg text-muted-foreground">Loading products...</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-8">
      <div className="flex items-center gap-3 text-center flex-col">
         <Music className="h-12 w-12 text-primary" />
        <h1 className="text-4xl font-headline font-bold text-primary">Our Products</h1>
        <p className="text-lg text-foreground/80 max-w-xl">
            Browse our collection of innovative VST plugins designed for modern music production.
        </p>
      </div>

      {products.length === 0 ? (
        <Card className="text-center py-12 shadow-lg">
          <CardHeader>
            <PackageSearch className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
            <CardTitle className="text-2xl font-headline text-primary">No Products Available Yet</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-lg text-foreground/80">
              We are working hard to bring you amazing VSTs. Check back soon!
            </CardDescription>
          </CardContent>
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1 overflow-hidden group">
              <CardHeader className="relative p-0">
                <Image
                  src={product.mainImage || "https://placehold.co/600x400.png?text=No+Image"}
                  alt={product.title}
                  width={600}
                  height={400}
                  className="object-cover w-full h-48 transition-transform duration-300 group-hover:scale-105"
                  data-ai-hint="instrument audio"
                />
              </CardHeader>
              <CardContent className="pt-4 flex-grow">
                <CardTitle className="font-headline text-xl text-primary mb-1 truncate group-hover:text-accent transition-colors">{product.title}</CardTitle>
                <CardDescription className="text-sm text-muted-foreground mb-2">Price: ${product.price.toFixed(2)}</CardDescription>
                <p className="text-sm text-foreground/70 line-clamp-3">{product.description}</p>
              </CardContent>
              <CardFooter className="p-4 border-t mt-auto">
                <Button variant="outline" size="sm" asChild className="w-full border-primary text-primary hover:bg-primary/10 hover:text-primary group-hover:border-accent group-hover:text-accent group-hover:bg-accent/10 transition-colors">
                  <Link href={`/products/${product.id}`}>
                    View Details <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

