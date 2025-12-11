// src/app/manage/product-form/page.tsx
"use client";

import { Suspense } from 'react';
import ProductForm from '@/components/product/ProductForm';
import { getProductById } from '@/lib/product-service-server';
import type { Pack, Product } from '@/lib/types';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Loader2, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

function ProductFormLoader() {
    const searchParams = useSearchParams();
    const isEditing = searchParams.get('edit') === 'true';
    const productId = searchParams.get('productId');
    const pack = searchParams.get('pack') as Pack | null;

    const [initialData, setInitialData] = useState<Product | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(isEditing);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isEditing && productId) {
            setIsLoading(true);
            setError(null);
            getProductById(productId)
                .then(product => {
                    if (product) {
                        setInitialData(product);
                    } else {
                        setError('Product not found. It may have been deleted or the ID is incorrect.');
                    }
                })
                .catch(() => {
                    setError('An error occurred while fetching the product data.');
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }
    }, [isEditing, productId]);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                <p className="text-lg text-muted-foreground">Loading Product Data...</p>
            </div>
        );
    }
    
    if (error) {
        return (
             <Card className="max-w-md mx-auto mt-10 shadow-lg border-destructive">
                <CardHeader className="bg-destructive text-destructive-foreground">
                <CardTitle className="flex items-center gap-2 font-headline">
                    <AlertTriangle /> Error Loading Product
                </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                <p className="text-destructive text-center">
                    {error}
                </p>
                </CardContent>
            </Card>
        )
    }

    if (isEditing && !initialData) {
        // This case handles when loading is finished but no data was found (and no error was set somehow)
        return null; 
    }

    return (
        <div className="animate-fade-in">
            <ProductForm 
                initialData={initialData} 
                isEditing={isEditing} 
                preselectedPack={!isEditing ? pack : undefined}
            />
        </div>
    );
}


export default function StandaloneProductFormPage() {
    return (
        <Suspense fallback={
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                <p className="text-lg text-muted-foreground">Loading Form...</p>
            </div>
        }>
            <ProductFormLoader />
        </Suspense>
    );
}
