// src/components/product/ProductForm.tsx
"use client";

import type { Product, ProductFormData, Pack } from '@/lib/types';
import { useForm, type SubmitHandler, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Loader2, Save, ClipboardCopy } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { generateProductJsonString, transformProductToFormData, generateSlug } from '@/lib/product-service';
import { useToast } from '@/hooks/use-toast';

const imageSchema = z.object({
  filename: z.string(),
  width: z.coerce.number().optional(),
  height: z.coerce.number().optional(),
}).refine(data => {
  if (data.filename) {
    return data.width !== undefined && data.width > 0 && data.height !== undefined && data.height > 0;
  }
  return true;
}, {
  message: "Width and Height are required if a filename is provided.",
  path: ["width"],
});


const mainImageSchema = imageSchema.extend({
  filename: z.string().min(1, "A main image filename is required"),
  width: z.coerce.number().min(1, "Width is required for the main image."),
  height: z.coerce.number().min(1, "Height is required for the main image."),
});


const downloadLinkSchema = z.object({
  enabled: z.boolean(),
  url: z.string().url().or(z.literal('')),
});

const productFormSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3, "Title must be at least 3 characters"),
  shortDescription: z.string().min(3, "Short description is required").max(100, "Short description must be 100 characters or less"),
  pack: z.enum(["Max! Pack", "Mad MIDI Machines Pack", "Free Pack"]),
  formats: z.object({
    vst: z.boolean(),
    vsti: z.boolean(),
    win32: z.boolean(),
    win64: z.boolean(),
    standAlone: z.boolean(),
    mac: z.boolean(),
    clap: z.boolean(),
    ios: z.boolean(),
    linux: z.boolean(),
  }),
  mainImage: mainImageSchema,
  thumbnails: z.array(imageSchema).max(7),
  description: z.string().min(10, "Description must be at least 10 characters").transform(val => val.replace(/\n/g, '\\n')),
  price: z.coerce.number().min(0, "Price must be a positive number"),
  downloadLink1: downloadLinkSchema,
  downloadLink2: downloadLinkSchema,
  downloadLink3: downloadLinkSchema,
  downloadLink4: downloadLinkSchema,
  demoLimitations: z.string().optional(),
  videoUrls: z.array(z.string().url().or(z.literal(''))).max(4),
}).refine(data => {
    // If a link is enabled, its URL must not be empty.
    if (data.downloadLink1.enabled && !data.downloadLink1.url) return false;
    if (data.downloadLink2.enabled && !data.downloadLink2.url) return false;
    if (data.downloadLink3.enabled && !data.downloadLink3.url) return false;
    if (data.downloadLink4.enabled && !data.downloadLink4.url) return false;
    return true;
}, {
    message: "Enabled download links must have a valid URL.",
    path: ["downloadLink1"], // You can specify a path, but the message is generic enough.
});

// Helper type for fetching state
type FetchingState = { [key: string]: boolean };

const ImageInput = ({
  fieldName,
  register,
  errors,
  setValue,
}: {
  fieldName: `mainImage` | `thumbnails.${number}`;
  register: any;
  errors?: any;
  setValue: any;
}) => {

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    setValue(fieldName + '.filename', event.target.value.toLowerCase(), { shouldValidate: true });
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-[1fr_80px_80px] gap-2 items-center">
      <Input
        {...register(`${fieldName}.filename`)}
        placeholder={fieldName.startsWith('main') ? "main-image.png" : "thumbnail.png"}
        onBlur={handleBlur}
      />
      <Input {...register(`${fieldName}.width`)} type="number" placeholder="W" />
      <Input {...register(`${fieldName}.height`)} type="number" placeholder="H" />
      {errors?.filename && <p className="text-sm text-destructive mt-1 sm:col-span-3">{errors.filename.message}</p>}
      {errors?.width && <p className="text-sm text-destructive mt-1 sm:col-span-3">{errors.width.message}</p>}
      {errors?.height && <p className="text-sm text-destructive mt-1 sm:col-span-3">{errors.height.message}</p>}
    </div>
  );
};


export default function ProductForm({ initialData, isEditing = false, preselectedPack }: { initialData?: Product; isEditing?: boolean; preselectedPack?: Pack; }) {
  const [jsonOutput, setJsonOutput] = useState('');
  const [targetFilename, setTargetFilename] = useState('');
  const { toast } = useToast();
  
  const { control, register, handleSubmit, formState: { errors, isSubmitting }, reset, watch, setValue, getValues } = useForm<ProductFormData>({
    resolver: zodResolver(productFormSchema),
    defaultValues: initialData 
      ? transformProductToFormData(initialData)
      : {
          title: '',
          shortDescription: '',
          pack: preselectedPack || "Max! Pack",
          formats: { vst: false, vsti: false, win32: false, win64: false, standAlone: false, mac: false, clap: false, ios: false, linux: false },
          mainImage: { filename: '', width: 0, height: 0 },
          thumbnails: Array(7).fill({ filename: '', width: 0, height: 0 }),
          description: '',
          price: 0,
          downloadLink1: { enabled: false, url: '' },
          downloadLink2: { enabled: false, url: '' },
          downloadLink3: { enabled: false, url: '' },
          downloadLink4: { enabled: false, url: '' },
          demoLimitations: '3 seconds silence every 15 seconds',
          videoUrls: Array(4).fill(''),
        },
  });
  
  const watchedPack = watch('pack');
  const watchedTitle = watch('title');

  useEffect(() => {
    if (watchedTitle) {
      setTargetFilename(`src/data/products/${generateSlug(watchedTitle)}.json`);
    } else {
      setTargetFilename('');
    }
  }, [watchedTitle]);

  useEffect(() => {
    if (watchedPack === 'Free Pack') {
      setValue('demoLimitations', '');
    } else {
       if (getValues('demoLimitations') === '') {
          setValue('demoLimitations', '3 seconds silence every 15 seconds');
       }
    }
  }, [watchedPack, setValue, getValues]);

  useEffect(() => {
    if (preselectedPack && !isEditing) {
      setValue('pack', preselectedPack);
    }
  }, [preselectedPack, isEditing, setValue]);


  const processSubmit: SubmitHandler<ProductFormData> = async (data) => {
    const jsonString = generateProductJsonString(data, isEditing);
    setJsonOutput(jsonString);
     toast({
        title: 'JSON Generated!',
        description: `Copy the JSON content below.`,
      });
  };
  
  const handleCopy = () => {
    navigator.clipboard.writeText(jsonOutput);
    toast({ title: 'Copied to clipboard!' });
  };

  const formatCheckboxes: { id: keyof ProductFormData['formats']; label: string }[] = [
      { id: 'vst', label: 'VST' },
      { id: 'vsti', label: 'VSTi' },
      { id: 'win32', label: 'Windows 32bit' },
      { id: 'win64', label: 'Windows 64bit' },
      { id: 'standAlone', label: 'Stand-Alone' },
      { id: 'mac', label: 'Mac' },
      { id: 'clap', label: 'CLAP' },
      { id: 'ios', label: 'iOS' },
      { id: 'linux', label: 'Linux' },
  ];

  const downloadLinkFields = [
      { id: 'downloadLink1', label: 'Download Option 1' },
      { id: 'downloadLink2', label: 'Download Option 2' },
      { id: 'downloadLink3', label: 'Download Stand-Alone (Op. 1)' },
      { id: 'downloadLink4', label: 'Download Stand-Alone (Op. 2)' },
  ] as const;


  return (
    <div className="space-y-4">
      <Card className="shadow-xl w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-headline text-primary">{isEditing ? `Edit Product: ${initialData?.title}` : `Add New Product to ${preselectedPack}`}</CardTitle>
          <CardDescription>
            Fill in the details. After generating, create a new JSON file with the suggested name and paste the content.
            Images are relative to `public/images/`.
          </CardDescription>
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
                <Label htmlFor="shortDescription" className="font-semibold">Short Description</Label>
                <Input id="shortDescription" {...register('shortDescription')} className="mt-1" placeholder="e.g., Arranger Module"/>
                {errors.shortDescription && <p className="text-sm text-destructive mt-1">{errors.shortDescription.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                    <Label htmlFor="pack" className="font-semibold">Product Pack</Label>
                    <Controller
                        control={control}
                        name="pack"
                        render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value} disabled={!!preselectedPack && !isEditing}>
                            <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select a pack" />
                            </SelectTrigger>
                            <SelectContent>
                            <SelectItem value="Max! Pack">Max! Pack</SelectItem>
                            <SelectItem value="Mad MIDI Machines Pack">Mad MIDI Machines Pack</SelectItem>
                            <SelectItem value="Free Pack">Free Pack</SelectItem>
                            </SelectContent>
                        </Select>
                        )}
                    />
                    {errors.pack && <p className="text-sm text-destructive mt-1">{errors.pack.message}</p>}
                </div>

                <div>
                    <Label className="font-semibold mb-2 block">Formats</Label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-4 items-center mt-3">
                        {formatCheckboxes.map(item => (
                            <Controller
                                key={item.id}
                                name={`formats.${item.id}`}
                                control={control}
                                render={({ field }) => (
                                    <div className="flex items-center gap-2">
                                        <Checkbox
                                            id={item.id}
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                        <Label htmlFor={item.id} className="font-normal">{item.label}</Label>
                                    </div>
                                )}
                            />
                        ))}
                    </div>
                    {errors.formats && <p className="text-sm text-destructive mt-1">Please select at least one format.</p>}
                </div>
            </div>
            
            <div>
              <Label htmlFor="mainImage.filename" className="font-semibold">Main Image</Label>
              <p className="text-xs text-muted-foreground mt-1">
                Enter the filename, Width, and Height. Filenames must be lowercase.
              </p>
              <ImageInput fieldName="mainImage" register={register} errors={errors.mainImage} setValue={setValue} />
            </div>

            <div className="space-y-2">
              <Label className="font-semibold">Thumbnail Images (up to 7)</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
                {[...Array(7)].map((_, index) => (
                  <div key={index}>
                      <ImageInput fieldName={`thumbnails.${index}`} register={register} errors={errors.thumbnails?.[index]} setValue={setValue} />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="description" className="font-semibold">Product Description</Label>
              <Textarea id="description" {...register('description')} rows={5} className="mt-1" placeholder="Detailed description of the product..."/>
              <p className="font-bold text-accent mt-2">
                Formatting: Use `##` for headlines and `#` for list items.
              </p>
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
                <Input id="demoLimitations" {...register('demoLimitations')} className="mt-1" readOnly={watchedPack === 'Free Pack'}/>
                {errors.demoLimitations && <p className="text-sm text-destructive mt-1">{errors.demoLimitations.message}</p>}
              </div>
            </div>

            <div className="space-y-4">
               <Label className="font-semibold">Download Links</Label>
               {downloadLinkFields.map((link) => (
                   <div key={link.id} className="grid grid-cols-[auto_1fr] items-center gap-4">
                       <Controller
                            name={`${link.id}.enabled`}
                            control={control}
                            render={({ field }) => (
                                <div className="flex items-center gap-2">
                                    <Checkbox id={`${link.id}.enabled`} checked={field.value} onCheckedChange={field.onChange} />
                                    <Label htmlFor={`${link.id}.enabled`} className="font-normal w-52">{link.label}</Label>
                                </div>
                            )}
                       />
                       <Input
                           {...register(`${link.id}.url`)}
                           placeholder="Enter URL..."
                       />
                        {errors[link.id]?.url && <p className="text-sm text-destructive col-span-2">{errors[link.id]?.url?.message}</p>}
                   </div>
               ))}
                {errors.downloadLink1 && !errors.downloadLink1.url && <p className="text-sm text-destructive">{errors.downloadLink1.message}</p>}
            </div>
            
             <div className="space-y-2">
              <Label className="font-semibold">YouTube Video URLs (up to 4)</Label>
              <div className="grid grid-cols-1 gap-2">
                  {[...Array(4)].map((_, index) => (
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
              {isEditing ? 'Generate Updated JSON' : 'Generate JSON for New Product'}
            </Button>
          </CardFooter>
        </form>
      </Card>

      {jsonOutput && (
        <Card className="shadow-xl w-full max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>Generated JSON Output</CardTitle>
             <div className="text-sm text-muted-foreground">
                <p>
                    {isEditing ? 'Copy this content and paste it into the file:' : 'Create a new file with this name and paste the content:'}
                </p>
                <p className="font-semibold font-mono text-accent mt-1">{targetFilename}</p>
            </div>
          </CardHeader>
          <CardContent className="relative">
            <Textarea
              readOnly
              value={jsonOutput}
              className="h-64 font-mono text-sm bg-muted"
              aria-label="Generated JSON for product"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-16 right-5 text-muted-foreground"
              onClick={handleCopy}
            >
              <ClipboardCopy className="h-5 w-5" />
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
