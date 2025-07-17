// src/app/manage/products-order/ProductOrderClientPage.tsx
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Product, Pack } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { ListOrdered, GripVertical, Save, ClipboardCopy, Loader2, Star, Box, Gift } from 'lucide-react';

const packConfig: Record<Pack, { icon: React.ElementType, title: string }> = {
  "Pro Pack": { icon: Star, title: "Pro Pack" },
  "Mad MIDI Machines Pack": { icon: Box, title: "Mad MIDI Machines" },
  "Free Pack": { icon: Gift, title: "Free Pack" },
};

// Sortable Item Component
function SortableItem({ product }: { product: Product }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: product.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="flex items-center bg-card p-3 rounded-lg border shadow-sm touch-none">
      <GripVertical className="h-5 w-5 text-muted-foreground mr-4 cursor-grab" />
      <span className="font-medium text-card-foreground">{product.title}</span>
    </div>
  );
}

// Main Page Component
export default function ProductOrderClientPage({ initialProducts }: { initialProducts: Product[] }) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [activePack, setActivePack] = useState<Pack>("Pro Pack");
  const [jsonOutput, setJsonOutput] = useState('');
  const [isClient, setIsClient] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setIsClient(true);
  }, []);
  
  const filteredProducts = useMemo(() => {
    return products.filter(p => p.pack === activePack);
  }, [products, activePack]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setProducts((currentProducts) => {
        const activeProduct = currentProducts.find(p => p.id === active.id);
        const overProduct = currentProducts.find(p => p.id === over.id);
        
        // Ensure both products are in the same pack before moving
        if (activeProduct && overProduct && activeProduct.pack === overProduct.pack) {
            const oldIndex = currentProducts.findIndex((item) => item.id === active.id);
            const newIndex = currentProducts.findIndex((item) => item.id === over.id);
            return arrayMove(currentProducts, oldIndex, newIndex);
        }
        return currentProducts;
      });
    }
  }

  function handleGenerateJson() {
    const orderedSlugs = products.map(p => p.slug);
    const jsonString = JSON.stringify(orderedSlugs, null, 2);
    setJsonOutput(jsonString);
    toast({
      title: 'JSON Generated!',
      description: 'Copy the content and paste it into src/data/product-order.json.',
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
                    onClick={() => setActivePack(pack)}
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
              Drag and drop products in the <span className="font-semibold text-accent">{packConfig[activePack].title}</span> to set their order.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!isClient ? (
              <div className="flex items-center justify-center h-48">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="ml-4 text-muted-foreground">Loading interactive list...</p>
              </div>
            ) : (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext items={filteredProducts.map(p => p.id)} strategy={verticalListSortingStrategy}>
                  <div className="space-y-3">
                    {filteredProducts.map((product) => (
                      <SortableItem key={product.id} product={product} />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            )}
          </CardContent>
          <CardFooter>
            <Button onClick={handleGenerateJson} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-3" disabled={!isClient}>
              <Save className="mr-2 h-5 w-5" />
              Generate Global Order JSON
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
                <code className="font-mono text-accent">src/data/product-order.json</code>
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
