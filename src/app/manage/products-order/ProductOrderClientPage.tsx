// src/app/manage/products-order/ProductOrderClientPage.tsx
"use client";

import React, { useState } from 'react';
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
import type { Product } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { ListOrdered, GripVertical, Save, ClipboardCopy } from 'lucide-react';

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
      <span className="text-sm text-muted-foreground ml-auto pr-2">({product.pack})</span>
    </div>
  );
}

// Main Page Component
export default function ProductOrderClientPage({ initialProducts }: { initialProducts: Product[] }) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [jsonOutput, setJsonOutput] = useState('');
  const { toast } = useToast();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setProducts((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
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
    <>
      <Card className="shadow-xl w-full max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <ListOrdered className="h-10 w-10 text-primary" />
            <CardTitle className="text-4xl font-headline text-primary">Products Order</CardTitle>
          </div>
          <CardDescription className="text-lg text-foreground/80">
            Drag and drop the products to set their display order on the website. The order is global across all packs.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={products.map(p => p.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-3">
                {products.map((product) => (
                  <SortableItem key={product.id} product={product} />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </CardContent>
        <CardFooter>
          <Button onClick={handleGenerateJson} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-3">
            <Save className="mr-2 h-5 w-5" />
            Generate Order JSON
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
    </>
  );
}
