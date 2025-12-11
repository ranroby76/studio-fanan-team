// src/app/manage/products-order/ProductOrderClientPage.tsx
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import type { Product, Pack } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { ListOrdered, GripVertical, Save, ClipboardCopy, Loader2, Star, Box, Gift } from 'lucide-react';
import { getProductsForPack } from '@/lib/product-service-server';

const packConfig: Record<Pack, { icon: React.ElementType, title: string, orderFile: string }> = {
  "Mad MIDI Machines Pack": { icon: Box, title: "Mad MIDI Machines", orderFile: "product-order-mad-midi-machines-pack.json" },
  "Max! Pack": { icon: Star, title: "Max! Pack", orderFile: "product-order-max-pack.json" },
  "Free Pack": { icon: Gift, title: "Free Pack", orderFile: "product-order-free-pack.json" },
};

// Item Component (no longer sortable)
function ProductItem({ product }: { product: Product }) {
  return (
    <div className="flex items-center bg-card p-3 rounded-lg border shadow-sm">
      <GripVertical className="h-5 w-5 text-muted-foreground mr-4" />
      <span className="font-medium text-card-foreground">{product.title}</span>
    </div>
  );
}

// Main Page Component
export default function ProductOrderClientPage({ initialProducts }: { initialProducts: Product[] }) {
  const [productsByPack, setProductsByPack] = useState<Record<Pack, Product[]>>({
    "Max! Pack": [],
    "Mad MIDI Machines Pack": [],
    "Free Pack": [],
  });

  const [activePack, setActivePack] = useState<Pack>("Mad MIDI Machines Pack");
  const [jsonOutput, setJsonOutput] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // This effect now fetches and sorts the products for the active pack
  useEffect(() => {
    async function fetchAndSetProducts() {
      setIsLoading(true);
      try {
        const prods = await getProductsForPack(activePack);
        setProductsByPack(prev => ({ ...prev, [activePack]: prods }));
      } catch (error) {
        console.error(`Failed to fetch products for ${activePack}`, error);
        toast({
          title: "Error",
          description: "Could not fetch products for the selected pack.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
    fetchAndSetProducts();
  }, [activePack, toast]);


  const activeProducts = useMemo(() => {
    return productsByPack[activePack] || [];
  }, [productsByPack, activePack]);


  function handleGenerateJson() {
    const orderedSlugs = activeProducts.map(p => p.slug);
    const jsonString = JSON.stringify(orderedSlugs, null, 2);
    setJsonOutput(jsonString);
    toast({
      title: `JSON for ${packConfig[activePack].title} Generated!`,
      description: `Copy the content and paste it into src/data/${packConfig[activePack].orderFile}`,
    });
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonOutput);
    toast({ title: 'Copied to clipboard!' });
  };

  return (
    <div className="flex flex-col md:flex-row gap-6">
      <aside className="w-full md:w-56">
        <Card className="shadow-lg">
          <CardHeader className="p-4 border-b">
             <CardTitle className="text-xl font-headline text-primary">Packs</CardTitle>
          </CardHeader>
          <CardContent className="p-2">
            <div className="flex flex-col space-y-1">
              {(Object.keys(packConfig) as Pack[]).map(pack => {
                const Conf = packConfig[pack];
                return (
                  <Button
                    key={pack}
                    variant={activePack === pack ? 'default' : 'ghost'}
                    onClick={() => {
                      setActivePack(pack);
                      setJsonOutput(''); // Clear output when switching packs
                    }}
                    className="w-full justify-start text-left h-auto py-2.5 px-3"
                  >
                    <Conf.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                    <span className="truncate">{Conf.title}</span>
                  </Button>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </aside>

      <div className="flex-1 space-y-4">
        <Card className="shadow-xl w-full max-w-2xl mx-auto">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <ListOrdered className="h-10 w-10 text-primary" />
              <CardTitle className="text-4xl font-headline text-primary">Products Order</CardTitle>
            </div>
            <CardDescription className="text-lg text-foreground/80">
              This list shows the current display order for products in the <span className="font-semibold text-accent">{packConfig[activePack].title}</span>.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center h-48">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="ml-4 text-muted-foreground">Loading product order...</p>
              </div>
            ) : (
              <div className="space-y-3">
                {activeProducts.map((product) => (
                  <ProductItem key={product.id} product={product} />
                ))}
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button onClick={handleGenerateJson} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-3">
              <Save className="mr-2 h-5 w-5" />
              Generate Order JSON for {packConfig[activePack].title}
            </Button>
          </CardFooter>
        </Card>

        {jsonOutput && (
          <Card className="shadow-xl w-full max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Generated JSON Output</CardTitle>
              <CardDescription>
                Copy this content and paste it into the file:
                <br />
                <code className="font-mono text-accent">src/data/{packConfig[activePack].orderFile}</code>
              </CardDescription>
            </CardHeader>
            <CardContent className="relative">
              <Textarea
                readOnly
                value={jsonOutput}
                className="h-64 font-mono text-sm bg-muted"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-20 right-5 text-muted-foreground"
                onClick={handleCopy}
              >
                <ClipboardCopy className="h-5 w-5" />
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
