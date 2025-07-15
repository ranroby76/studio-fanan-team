// src/components/product/ProductForm.tsx
"use client";

import type { ProductFormData } from '@/lib/types';
import { useForm, useFieldArray, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Trash2, Loader2 } from 'lucide-react';
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Controller } from 'react-hook-form';

const packEnum = z.enum(["Pro Pack", "Mad MIDI Machines Pack", "Free Pack"]);

const downloadLinkSchema = z.object({
  id: z.string().optional(), // Optional for new links
  label: z.string().min(1, "Label is required"),
  url: z.string().url("Must be a valid URL"),
});

const productFormSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3, "Title must be at least 3 characters"),
  slug: z.string().min(3, "Slug must be at least 3 characters").regex(/^[a-z0-9-]+$/, "Slug must be lowercase with no spaces"),
  pack: packEnum,
  mainImage: z.string().url("Main image must be a valid URL"),
  thumbnails: z.array(z.string().url("Thumbnail must be a valid URL")).min(0).max(5, "Maximum 5 thumbnails"),
  keywords: z.string().optional(),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.coerce.number().min(0, "Price must be a positive number"),
  downloadLinks: z.array(downloadLinkSchema).min(1, "At least one download link is required"),
  demoLimitations: z.string().min(5, "Demo limitations must be at least 5 characters"),
});

interface ProductFormProps {
  initialData?: ProductFormData;
  onSubmit: (data: ProductFormData) => Promise<void>;
  isEditing?: boolean;
}

export default function ProductForm({ initialData, onSubmit, isEditing = false }: ProductFormProps) {
  const { toast } = useToast();

  const { control, register, handleSubmit, formState: { errors, isSubmitting }, reset, watch } = useForm<ProductFormData>({
    resolver: zodResolver(productFormSchema),
    defaultValues: initialData || {
      title: '',
      slug: '',
      pack: "Pro Pack",
      mainImage: '',
      thumbnails: [],
      keywords: '',
      description: '',
      price: 0,
      downloadLinks: [{ id: '', label: '', url: '' }],
      demoLimitations: '',
    },
  });

  const { fields: thumbnailFields, append: appendThumbnail, remove: removeThumbnail } = useFieldArray({
    control,
    name: "thumbnails",
  });

  const { fields: downloadLinkFields, append: appendDownloadLink, remove: removeDownloadLink } = useFieldArray({
    control,
    name: "downloadLinks",
  });

  const processSubmit: SubmitHandler<ProductFormData> = async (data) => {
    await onSubmit(data);
    if (!isEditing) {
     reset(); // Reset form only if adding new product
    }
  };

  return (
    <Card className="shadow-xl w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-3xl font-headline text-primary">{isEditing ? 'Edit Product' : 'Add New Product'}</CardTitle>
        <CardDescription>Fill in the details for the VST product. The slug will be used for the product page URL.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(processSubmit)}>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title" className="font-semibold">Product Title</Label>
              <Input id="title" {...register('title')} className="mt-1" placeholder="e.g., SuperSynth Pro"/>
              {errors.title && <p className="text-sm text-destructive mt-1">{errors.title.message}</p>}
            </div>
            <div>
              <Label htmlFor="slug" className="font-semibold">URL Slug</Label>
              <Input id="slug" {...register('slug')} className="mt-1" placeholder="e.g., supersynth-pro"/>
              {errors.slug && <p className="text-sm text-destructive mt-1">{errors.slug.message}</p>}
            </div>
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

          <div>
            <Label htmlFor="mainImage" className="font-semibold">Main Image URL</Label>
            <Input id="mainImage" {...register('mainImage')} className="mt-1" placeholder="https://placehold.co/800x400.png"/>
            {errors.mainImage && <p className="text-sm text-destructive mt-1">{errors.mainImage.message}</p>}
          </div>

          <div className="space-y-2">
            <Label className="font-semibold">Thumbnail Image URLs (up to 5)</Label>
            {thumbnailFields.map((field, index) => (
              <div key={field.id} className="flex items-center gap-2">
                <Input
                  {...register(`thumbnails.${index}` as const)}
                  placeholder={`https://placehold.co/100x100.png?text=Thumb+${index+1}`}
                  className="flex-grow"
                />
                <Button type="button" variant="outline" size="icon" onClick={() => removeThumbnail(index)} aria-label="Remove thumbnail">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            {errors.thumbnails && <p className="text-sm text-destructive mt-1">{errors.thumbnails.message || (errors.thumbnails as any)?.root?.message}</p>}
            {thumbnailFields.length < 5 && (
              <Button type="button" variant="outline" size="sm" onClick={() => appendThumbnail('')}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add Thumbnail
              </Button>
            )}
          </div>
          
          <div>
            <Label htmlFor="keywords" className="font-semibold">Keywords (optional, for reference)</Label>
            <div className="flex items-center gap-2 mt-1">
              <Input id="keywords" {...register('keywords')} placeholder="e.g., analog synth, warm pads, 80s sound" className="flex-grow" />
            </div>
            {errors.keywords && <p className="text-sm text-destructive mt-1">{errors.keywords.message}</p>}
          </div>

          <div>
            <Label htmlFor="description" className="font-semibold">Product Description</Label>
            <Textarea id="description" {...register('description')} rows={5} className="mt-1" placeholder="Detailed description of the product..."/>
            {errors.description && <p className="text-sm text-destructive mt-1">{errors.description.message}</p>}
          </div>

          <div>
            <Label htmlFor="price" className="font-semibold">Price (USD)</Label>
            <Input id="price" type="number" step="0.01" {...register('price')} className="mt-1" placeholder="e.g., 49.99"/>
            {errors.price && <p className="text-sm text-destructive mt-1">{errors.price.message}</p>}
          </div>

          <div className="space-y-3">
            <Label className="font-semibold">Download Links</Label>
            {downloadLinkFields.map((field, index) => (
              <Card key={field.id} className="p-3 bg-muted/50">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-end">
                  <div>
                    <Label htmlFor={`downloadLinks.${index}.label`} className="text-xs">Label</Label>
                    <Input
                      id={`downloadLinks.${index}.label`}
                      {...register(`downloadLinks.${index}.label` as const)}
                      placeholder="e.g., Windows VST3"
                      className="mt-1"
                    />
                    {errors.downloadLinks?.[index]?.label && <p className="text-sm text-destructive mt-1">{errors.downloadLinks[index]?.label?.message}</p>}
                  </div>
                   <div>
                    <Label htmlFor={`downloadLinks.${index}.url`} className="text-xs">URL</Label>
                    <Input
                      id={`downloadLinks.${index}.url`}
                      {...register(`downloadLinks.${index}.url` as const)}
                      placeholder="https://download.example.com/product.zip"
                      className="mt-1"
                    />
                    {errors.downloadLinks?.[index]?.url && <p className="text-sm text-destructive mt-1">{errors.downloadLinks[index]?.url?.message}</p>}
                  </div>
                </div>
                <Button type="button" variant="ghost" size="sm" onClick={() => removeDownloadLink(index)} className="mt-2 text-destructive hover:text-destructive hover:bg-destructive/10 float-right">
                  <Trash2 className="mr-1 h-4 w-4" /> Remove Link
                </Button>
              </Card>
            ))}
            {errors.downloadLinks && typeof errors.downloadLinks.message === 'string' && (
                 <p className="text-sm text-destructive mt-1">{errors.downloadLinks.message}</p>
            )}
            <Button type="button" variant="outline" size="sm" onClick={() => appendDownloadLink({id: '', label: '', url: '' })}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Download Link
            </Button>
          </div>

          <div>
            <Label htmlFor="demoLimitations" className="font-semibold">Demo Limitations</Label>
            <Textarea id="demoLimitations" {...register('demoLimitations')} rows={3} className="mt-1" placeholder="e.g., Audio dropouts every 30 seconds, saving disabled..."/>
            {errors.demoLimitations && <p className="text-sm text-destructive mt-1">{errors.demoLimitations.message}</p>}
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-3" disabled={isSubmitting}>
            {isSubmitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            {isEditing ? 'Save Changes' : 'Add Product'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
