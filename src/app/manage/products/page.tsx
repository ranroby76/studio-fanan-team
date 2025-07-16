// src/app/manage/products/page.tsx
"use client";

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Edit3, Trash2, Loader2, PackageSearch, Package, ExternalLink, ClipboardCopy } from 'lucide-react';
import type { Product } from '@/lib/types';
import { getProducts, generateJsonForDelete } from '@/lib/product-service';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
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

export default function ProductsManagementPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [jsonForDelete, setJsonForDelete] = useState('');
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const { toast } = useToast();

  const fetchProducts = useCallback(() => {
    setIsLoading(true);
    try {
      const prods = getProducts();
      setProducts(prods);
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
  }, [toast]);

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
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <Package className="h-10 w-10 text-primary" />
          <h1 className="text-4xl font-headline font-bold text-primary">Product Catalog</h1>
        </div>
        <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-md hover:shadow-lg transition-shadow">
          <Link href="/manage/add">
            <PlusCircle className="mr-2 h-5 w-5" /> Add New Product
          </Link>
        </Button>
      </div>

      {products.length === 0 ? (
        <Card className="text-center py-12 shadow-lg">
          <CardHeader>
            <PackageSearch className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
            <CardTitle className="text-2xl font-headline text-primary">No Products Yet</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-lg text-foreground/80">
              Start by adding your first VST product to the catalog.
            </CardDescription>
          </CardContent>
          <CardFooter className="justify-center">
             <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Link href="/manage/add">
                <PlusCircle className="mr-2 h-5 w-5" /> Add Your First Product
              </Link>
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="relative p-0">
                <Image
                  src={product.mainImage?.url || "https://placehold.co/600x400.png"}
                  alt={product.title}
                  width={600}
                  height={400}
                  className="object-cover w-full h-48 rounded-t-lg"
                  data-ai-hint="instrument audio"
                />
                 <Badge variant="secondary" className="absolute top-2 right-2">{product.pack}</Badge>
              </CardHeader>
              <CardContent className="pt-4 flex-grow">
                <CardTitle className="font-headline text-xl text-primary mb-1 truncate">{product.title}</CardTitle>
                <CardDescription className="text-sm text-muted-foreground mb-2">Price: ${product.price.toFixed(2)}</CardDescription>
                <p className="text-sm text-foreground/70 line-clamp-3">{product.description}</p>
              </CardContent>
              <CardFooter className="grid grid-cols-3 gap-2 pt-0 p-4 border-t mt-auto">
                <Button variant="outline" size="sm" asChild>
                    <Link href={`/products/${product.slug}`} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="mr-2 h-4 w-4" /> View
                    </Link>
                </Button>
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
