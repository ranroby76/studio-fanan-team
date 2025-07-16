// src/components/product/ProductForm.tsx
"use client";

import type { Product, ProductFormData } from '@/lib/types';
import { useForm, type SubmitHandler, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { PlusCircle, Trash2, Loader2, Save } from 'lucide-react';
import React, { useEffect } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';


// Updated schema to reflect form changes
const productFormSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3, "Title must be at least 3 characters"),
  pack: z.enum(["Pro Pack", "Mad MIDI Machines Pack", "Free Pack"]),
  mainImage: z.string().url("A valid URL for the main image is required"),
  thumbnails: z.array(z.string().optional()).max(7),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.coerce.number().min(0, "Price must be a positive number"),
  winVst3Url: z.string().url("A valid URL is required for the Windows download"),
  macVst3Url: z.string().url("A valid URL is required for the macOS download"),
  demoLimitations: z.string().optional(),
  videoUrls: z.array(z.string().optional()).max(3),
});

// Helper to transform full Product data to form-compatible data for editing
const transformProductToFormData = (product: Product): ProductFormData => {
  const thumbnails = [...product.thumbnails];
  while (thumbnails.length < 7) {
    thumbnails.push('');
  }
  const videoUrls = [...(product.videoUrls || [])];
   while (videoUrls.length < 3) {
    videoUrls.push('');
  }
  return {
    id: product.id,
    title: product.title,
    pack: product.pack,
    mainImage: product.mainImage,
    thumbnails: thumbnails,
    description: product.description,
    price: product.price,
    winVst3Url: product.downloadLinks.find(l => l.label.includes('Windows'))?.url || '',
    macVst3Url: product.downloadLinks.find(l => l.label.includes('macOS'))?.url || '',
    demoLimitations: product.demoLimitations,
    videoUrls: videoUrls,
  };
};

interface ProductFormProps {
  initialData?: Product; // Accept full Product object
  onSubmit: (data: ProductFormData) => Promise<void>;
  isEditing?: boolean;
}

export default function ProductForm({ initialData, onSubmit, isEditing = false }: ProductFormProps) {
  const { toast } = useToast();
  
  const form = useForm<ProductFormData>({
    resolver: zodResolver(productFormSchema),
    defaultValues: initialData 
      ? transformProductToFormData(initialData)
      : {
          title: '',
          pack: "Pro Pack",
          mainImage: '',
          thumbnails: Array(7).fill(''),
          description: '',
          price: 0,
          winVst3Url: '',
          macVst3Url: '',
          demoLimitations: '3 seconds silence every 15 seconds',
          videoUrls: Array(3).fill(''),
        },
  });
  
  const { control, register, handleSubmit, formState: { errors, isSubmitting }, reset, watch, setValue } = form;

  const watchedPack = watch('pack');

  useEffect(() => {
    if (watchedPack === 'Free Pack') {
      setValue('demoLimitations', '');
    } else {
      setValue('demoLimitations', '3 seconds silence every 15 seconds');
    }
  }, [watchedPack, setValue]);

  const processSubmit: SubmitHandler<ProductFormData> = async (data) => {
    await onSubmit(data);
    if (!isEditing) {
     reset();
    }
  };

  return (
    <Card className="shadow-xl w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-3xl font-headline text-primary">{isEditing ? 'Edit Product' : 'Add New Product'}</CardTitle>
        <CardDescription>Fill in the details for the product. A URL-friendly slug will be automatically generated from the title.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(processSubmit)}>
        <CardContent className="space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="title" className="font-semibold">Product Title</Label>
              <Input id="title" {...register('title')} className="mt-1" placeholder="e.g., SuperSynth Pro"/>
              {errors.title && <p className="text-sm text-destructive mt-1">{errors.title.message}</p>}
            </div>
            <div>
              <Label htmlFor="pack" className="font-semibold">Product Pack</Label>
               <Controller
                  control={control}
                  name="pack"
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select a pack" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pro Pack">Pro Pack</SelectItem>
                        <SelectItem value="Mad MIDI Machines Pack">Mad MIDI Machines Pack</SelectItem>
                        <SelectItem value="Free Pack">Free Pack</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              {errors.pack && <p className="text-sm text-destructive mt-1">{errors.pack.message}</p>}
            </div>
          </div>
          
          <div>
            <Label htmlFor="mainImage" className="font-semibold">Main Image URL</Label>
            <Input id="mainImage" {...register('mainImage')} className="mt-1" placeholder="https://.../main-image.png"/>
            {errors.mainImage && <p className="text-sm text-destructive mt-1">{errors.mainImage.message}</p>}
          </div>

          <div className="space-y-2">
            <Label className="font-semibold">Thumbnail Image URLs (up to 7)</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
              {[...Array(7)].map((_, index) => (
                <div key={index}>
                  <Input
                    {...register(`thumbnails.${index}` as const)}
                    placeholder={`Thumbnail ${index + 1} URL`}
                    className="flex-grow"
                  />
                  {errors.thumbnails?.[index] && <p className="text-sm text-destructive mt-1">{errors.thumbnails[index]?.message}</p>}
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="description" className="font-semibold">Product Description</Label>
            <Textarea id="description" {...register('description')} rows={5} className="mt-1" placeholder="Detailed description of the product..."/>
            {errors.description && <p className="text-sm text-destructive mt-1">{errors.description.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="price" className="font-semibold">Price (USD)</Label>
              <Input id="price" type="number" step="0.01" {...register('price')} className="mt-1" placeholder="e.g., 22.00 (enter 0 for free)"/>
              {errors.price && <p className="text-sm text-destructive mt-1">{errors.price.message}</p>}
            </div>
             <div>
              <Label htmlFor="demoLimitations" className="font-semibold">Demo Limitations</Label>
              <Input id="demoLimitations" {...register('demoLimitations')} className="mt-1" readOnly={watchedPack !== 'Free Pack'}/>
              {errors.demoLimitations && <p className="text-sm text-destructive mt-1">{errors.demoLimitations.message}</p>}
            </div>
          </div>

          <div className="space-y-3">
             <Label className="font-semibold">Download Links</Label>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <Input {...register('winVst3Url')} placeholder="Windows Download URL"/>
                    {errors.winVst3Url && <p className="text-sm text-destructive mt-1">{errors.winVst3Url.message}</p>}
                </div>
                 <div>
                    <Input {...register('macVst3Url')} placeholder="macOS Download URL"/>
                    {errors.macVst3Url && <p className="text-sm text-destructive mt-1">{errors.macVst3Url.message}</p>}
                </div>
             </div>
          </div>
          
           <div className="space-y-2">
            <Label className="font-semibold">YouTube Video URLs (up to 3)</Label>
            <div className="grid grid-cols-1 gap-2">
                {[...Array(3)].map((_, index) => (
                    <Input
                        key={index}
                        {...register(`videoUrls.${index}` as const)}
                        placeholder={`YouTube Video URL ${index + 1}`}
                    />
                ))}
            </div>
            {errors.videoUrls && <p className="text-sm text-destructive mt-1">Please enter valid YouTube URLs.</p>}
           </div>

        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-3" disabled={isSubmitting}>
             <Save className="mr-2 h-5 w-5" />
            {isSubmitting ? ( <Loader2 className="mr-2 h-4 w-4 animate-spin" /> ) : null}
            {isEditing ? 'Save Changes' : 'Add Product'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
