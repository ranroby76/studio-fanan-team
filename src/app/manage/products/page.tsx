// src/app/manage/products/page.tsx
"use client";

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Edit3, Trash2, Loader2, PackageSearch } from 'lucide-react';
import type { Product } from '@/lib/types';
import { getProducts, deleteProduct as deleteProductService } from '@/lib/product-service';
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

export default function ProductsManagementPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
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
        description: "Could not fetch products from local storage.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleDeleteProduct = (id: string) => {
    try {
      const success = deleteProductService(id);
      if (success) {
        toast({
          title: "Product Deleted",
          description: "The product has been successfully deleted.",
        });
        fetchProducts(); // Re-fetch products to update the list
      } else {
        toast({
          title: "Error",
          description: "Could not delete the product.",
          variant: "destructive",
        });
      }
    } catch (error) {
       console.error("Error deleting product:", error);
       toast({
        title: "Error",
        description: "An unexpected error occurred while deleting the product.",
        variant: "destructive",
      });
    }
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
                  src={product.mainImage || "https://placehold.co/600x400.png?text=No+Image"}
                  alt={product.title}
                  width={600}
                  height={400}
                  className="object-cover w-full h-48 rounded-t-lg"
                  data-ai-hint="instrument audio"
                />
              </CardHeader>
              <CardContent className="pt-4 flex-grow">
                <CardTitle className="font-headline text-xl text-primary mb-1 truncate">{product.title}</CardTitle>
                <CardDescription className="text-sm text-muted-foreground mb-2">Price: ${product.price.toFixed(2)}</CardDescription>
                <p className="text-sm text-foreground/70 line-clamp-3">{product.description}</p>
              </CardContent>
              <CardFooter className="grid grid-cols-2 gap-2 pt-0 p-4 border-t mt-auto">
                <Button variant="outline" size="sm" asChild className="border-accent text-accent hover:bg-accent/10">
                  <Link href={`/manage/edit/${product.id}`}>
                    <Edit3 className="mr-2 h-4 w-4" /> Edit
                  </Link>
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm" className="bg-destructive/90 hover:bg-destructive text-destructive-foreground">
                      <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle className="font-headline">Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the product "{product.title}".
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDeleteProduct(product.id)} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
                        Yes, delete product
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
