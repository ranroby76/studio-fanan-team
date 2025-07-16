// src/app/manage/products/page.tsx
"use client";

import { useEffect, useState, useCallback, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Edit3, Trash2, Loader2, PackageSearch, Package, ExternalLink, ClipboardCopy, Star, Box, Gift } from 'lucide-react';
import type { Product, Pack } from '@/lib/types';
import { getProducts, generateJsonForDelete } from '@/lib/product-service';
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
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

// Helper to format the tags
const formatTags = (formats: Product['formats']) => {
  const parts: string[] = [];
  if (formats.vst) parts.push('VST');
  if (formats.vsti) parts.push('VSTi');
  
  const winFormats: string[] = [];
  if (formats.win32) winFormats.push('32bit');
  if (formats.win64) winFormats.push('64bit');

  if (winFormats.length > 0) {
    parts.push(`Windows ${winFormats.join('/')}`);
  }
  
  return parts.join(' | ');
};

const packConfig: Record<Pack, { icon: React.ElementType, title: string }> = {
  "Pro Pack": { icon: Star, title: "Pro Pack" },
  "Mad MIDI Machines Pack": { icon: Box, title: "Mad MIDI Machines" },
  "Free Pack": { icon: Gift, title: "Free Pack" },
};


function ProductsManagementComponent() {
  const searchParams = useSearchParams();
  const activePack = (searchParams.get('pack') as Pack | null) || "Pro Pack";

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [jsonForDelete, setJsonForDelete] = useState('');
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const { toast } = useToast();

  const fetchProducts = useCallback(() => {
    setIsLoading(true);
    try {
      const allProds = getProducts();
      const filteredProds = allProds.filter(p => p.pack === activePack);
      setProducts(filteredProds);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast({
        title: "Error",
        description: "Could not fetch products from products.json.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast, activePack]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleDeleteProduct = (product: Product) => {
    try {
      setProductToDelete(product);
      const jsonString = generateJsonForDelete(product.id);
      setJsonForDelete(jsonString);
    } catch (error) {
       console.error("Error generating delete JSON:", error);
       toast({
        title: "Error",
        description: "Could not prepare the product for deletion.",
        variant: "destructive",
      });
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonForDelete);
    toast({ title: 'Copied to clipboard!', description: 'Paste the new content into src/data/products.json to finalize deletion.' });
  };

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-8">
          {products.map((product) => (
            <Card key={product.id} className="group flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden bg-card">
              <Link href={`/products/${product.slug}`} className="block">
                <div className="relative overflow-hidden aspect-[4/3] bg-muted">
                  {product.mainImage?.url ? (
                     <Image
                      src={product.mainImage.url}
                      alt={product.title}
                      fill
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                      data-ai-hint="instrument audio"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ): (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
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
                 <p className="text-xs text-muted-foreground text-center truncate">{formatTags(product.formats)}</p>
              </div>

              <CardFooter className="grid grid-cols-2 gap-2 mt-auto p-2 border-t bg-muted/50">
                <Button variant="outline" size="sm" asChild className="border-accent text-accent hover:bg-accent/10">
                  <Link href={`/manage/edit/${product.id}`}>
                    <Edit3 className="mr-2 h-4 w-4" /> Edit
                  </Link>
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm" onClick={() => handleDeleteProduct(product)} className="bg-destructive/90 hover:bg-destructive text-destructive-foreground">
                      <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle className="font-headline">Delete &quot;{productToDelete?.title}&quot;?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action will generate an updated JSON array. You must copy it and replace the content of `src/data/products.json` to finalize the deletion.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="relative">
                       <Textarea
                          readOnly
                          value={jsonForDelete}
                          className="h-48 font-mono text-sm bg-muted"
                          aria-label="Updated JSON content for products"
                        />
                         <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-2 right-2 text-muted-foreground"
                          onClick={handleCopy}
                        >
                          <ClipboardCopy className="h-5 w-5" />
                        </Button>
                    </div>
                    <AlertDialogFooter>
                      <AlertDialogCancel onClick={() => setJsonForDelete('')}>Close</AlertDialogCancel>
                      <AlertDialogAction onClick={handleCopy}>Copy JSON & Close</AlertDialogAction>
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
