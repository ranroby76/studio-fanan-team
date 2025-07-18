// src/app/manage/products/page.tsx
"use client";

import { useEffect, useState, useCallback, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Edit3, Trash2, Loader2, PackageSearch, Package, Star, Box, Gift } from 'lucide-react';
import type { Product, Pack } from '@/lib/types';
import { formatTags, generateSlug } from '@/lib/product-service';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { getProductsForPack } from '@/lib/product-service-server';

const packConfig: Record<Pack, { icon: React.ElementType, title: string }> = {
  "Mad MIDI Machines Pack": { icon: Box, title: "Mad MIDI Machines" },
  "Max! Pack": { icon: Star, title: "Max! Pack" },
  "Free Pack": { icon: Gift, title: "Free Pack" },
};


function ProductsManagementComponent() {
  const searchParams = useSearchParams();
  const activePack = (searchParams.get('pack') as Pack | null) || "Mad MIDI Machines Pack";

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const { toast } = useToast();

  const fetchProducts = useCallback(async (pack: Pack) => {
    setIsLoading(true);
    try {
      // This is now an async server action call
      const prods = await getProductsForPack(pack);
      setProducts(prods);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast({
        title: "Error",
        description: "Could not fetch products. Check the data source.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchProducts(activePack);
  }, [activePack, fetchProducts]);


  const ActiveIcon = packConfig[activePack]?.icon || Package;

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 border-b pb-4">
        <div className="flex items-center gap-3">
          <ActiveIcon className="h-10 w-10 text-primary" />
          <h1 className="text-4xl font-headline font-bold text-primary">{packConfig[activePack]?.title || 'Product'} Catalog</h1>
        </div>
         <div className="flex items-center gap-2 p-1 bg-muted rounded-lg">
          {(Object.keys(packConfig) as Pack[]).map(pack => (
            <Button key={pack} asChild variant={activePack === pack ? 'default' : 'ghost'} className="shadow-sm">
              <Link href={`/manage/products?pack=${encodeURIComponent(pack)}`}>{packConfig[pack].title}</Link>
            </Button>
          ))}
        </div>
      </div>
      
      <div className="flex justify-end">
        <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-md hover:shadow-lg transition-shadow">
          <Link href={`/manage/add?pack=${encodeURIComponent(activePack)}`}>
            <PlusCircle className="mr-2 h-5 w-5" /> Add New Product to {packConfig[activePack].title}
          </Link>
        </Button>
      </div>


      {isLoading ? (
         <div className="flex flex-col items-center justify-center min-h-[calc(100vh-400px)]">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <p className="text-lg text-muted-foreground">Loading products for {packConfig[activePack].title}...</p>
          </div>
      ) : products.length === 0 ? (
        <Card className="text-center py-12 shadow-lg">
          <CardHeader>
            <PackageSearch className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
            <CardTitle className="text-2xl font-headline text-primary">No Products in {packConfig[activePack].title}</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-lg text-foreground/80">
              Start by adding your first product to this pack.
            </CardDescription>
          </CardContent>
        </Card>
      ) : (
        <div className="columns-1 md:columns-2 gap-8 space-y-8">
          {products.map((product) => (
            <Card key={product.id} className="group flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden bg-card break-inside-avoid">
              <Link href={`/products/${product.slug}`} className="block">
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
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                </div>
                <div className="p-4 bg-background flex-grow flex flex-col">
                  <h3 className="text-xl font-bold font-headline text-primary truncate">{product.title}</h3>
                  <p className="text-sm text-foreground/80 h-10 line-clamp-2 flex-grow">{product.shortDescription}</p>
                </div>
              </Link>

              <div className="p-3 border-t bg-muted/30">
                 <p className="text-base text-muted-foreground text-center truncate w-full">{formatTags(product.formats)}</p>
              </div>

              <CardFooter className="grid grid-cols-2 gap-2 mt-auto p-2 border-t bg-muted/50">
                <Button variant="outline" size="sm" asChild className="border-accent text-accent hover:bg-accent/10">
                  <Link href={`/manage/edit/${product.id}`}>
                    <Edit3 className="mr-2 h-4 w-4" /> Edit
                  </Link>
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm" onClick={() => setProductToDelete(product)} className="bg-destructive/90 hover:bg-destructive text-destructive-foreground">
                      <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle className="font-headline">Delete &quot;{productToDelete?.title}&quot;?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action is permanent. To finalize deletion, you must manually delete the following file from your project:
                        <br />
                        <code className="bg-muted text-muted-foreground px-2 py-1 rounded-md mt-2 block font-mono text-sm">
                          src/data/products/{productToDelete ? generateSlug(productToDelete.title) : ''}.json
                        </code>
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel onClick={() => setProductToDelete(null)}>Cancel</AlertDialogCancel>
                      <AlertDialogAction asChild>
                         <Button onClick={() => setProductToDelete(null)} variant="destructive">I Understand, Close</Button>
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}


export default function ProductsManagementPage() {
  return (
    <Suspense fallback={<Loader2 className="h-12 w-12 animate-spin text-primary" />}>
      <ProductsManagementComponent />
    </Suspense>
  )
}
