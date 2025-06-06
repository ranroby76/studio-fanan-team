// src/app/manage/gui-me-editor/page.tsx
"use client";

import { useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Palette, Save } from 'lucide-react';
import type { GuiMeContentFormData } from '@/lib/types';
import { getGuiMeContent, saveGuiMeContent } from '@/lib/gui-me-service';

const guiMeFormSchema = z.object({
  homePageBannerUrl: z.string().url("Must be a valid URL for Home Page Banner").or(z.literal('')).optional(),
  guiMePageBannerUrl: z.string().url("Must be a valid URL for GUI Me Page Banner").or(z.literal('')).optional(),
  title1: z.string().optional(),
  text1: z.string().optional(),
  title2: z.string().optional(),
  text2: z.string().optional(),
  title3: z.string().optional(),
  text3: z.string().optional(),
});

export default function GuiMeEditorPage() {
  const { toast } = useToast();
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset, setValue } = useForm<GuiMeContentFormData>({
    resolver: zodResolver(guiMeFormSchema),
    defaultValues: {
      homePageBannerUrl: '',
      guiMePageBannerUrl: '',
      title1: '',
      text1: '',
      title2: '',
      text2: '',
      title3: '',
      text3: '',
    },
  });

  useEffect(() => {
    const currentContent = getGuiMeContent();
    if (currentContent) {
      reset(currentContent);
    }
  }, [reset]);

  const onSubmit: SubmitHandler<GuiMeContentFormData> = async (data) => {
    try {
      saveGuiMeContent(data);
      toast({
        title: 'Content Saved!',
        description: 'Your GUI Me page content has been updated.',
      });
    } catch (error) {
      console.error("Error saving GUI ME content:", error);
      toast({
        title: 'Error',
        description: 'Failed to save content. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="animate-fade-in">
      <Card className="shadow-xl w-full max-w-3xl mx-auto">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <Palette className="h-10 w-10 text-primary" />
            <CardTitle className="text-4xl font-headline text-primary">GUI ME Content Editor</CardTitle>
          </div>
          <CardDescription className="text-lg text-foreground/80">
            Manage the dynamic content for your Home page banner and the GUI Me page.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="homePageBannerUrl" className="font-semibold">Home Page Banner Image URL</Label>
              <Input id="homePageBannerUrl" {...register('homePageBannerUrl')} className="mt-1" placeholder="https://firebasestorage.googleapis.com/..." />
              <p className="text-xs text-muted-foreground mt-1">
                Please use the full HTTPS download URL from Firebase Storage (it starts with "https://firebasestorage.googleapis.com/..."). Do not use "gs://" links.
              </p>
              {errors.homePageBannerUrl && <p className="text-sm text-destructive mt-1">{errors.homePageBannerUrl.message}</p>}
            </div>

            <div>
              <Label htmlFor="guiMePageBannerUrl" className="font-semibold">GUI Me Page Banner Image URL</Label>
              <Input id="guiMePageBannerUrl" {...register('guiMePageBannerUrl')} className="mt-1" placeholder="https://firebasestorage.googleapis.com/..." />
              <p className="text-xs text-muted-foreground mt-1">
                Please use the full HTTPS download URL from Firebase Storage (it starts with "https://firebasestorage.googleapis.com/..."). Do not use "gs://" links.
              </p>
              {errors.guiMePageBannerUrl && <p className="text-sm text-destructive mt-1">{errors.guiMePageBannerUrl.message}</p>}
            </div>
            
            <hr className="my-6 border-border" />

            <h3 className="text-xl font-headline text-primary">GUI Me Page Content Sections</h3>
            
            <div>
              <Label htmlFor="title1" className="font-semibold">Title 1</Label>
              <Input id="title1" {...register('title1')} className="mt-1" placeholder="Enter Title 1" />
              {errors.title1 && <p className="text-sm text-destructive mt-1">{errors.title1.message}</p>}
            </div>
            <div>
              <Label htmlFor="text1" className="font-semibold">Text 1</Label>
              <Textarea id="text1" {...register('text1')} rows={3} className="mt-1" placeholder="Enter Text 1" />
              {errors.text1 && <p className="text-sm text-destructive mt-1">{errors.text1.message}</p>}
            </div>

            <div>
              <Label htmlFor="title2" className="font-semibold">Title 2</Label>
              <Input id="title2" {...register('title2')} className="mt-1" placeholder="Enter Title 2" />
              {errors.title2 && <p className="text-sm text-destructive mt-1">{errors.title2.message}</p>}
            </div>
            <div>
              <Label htmlFor="text2" className="font-semibold">Text 2</Label>
              <Textarea id="text2" {...register('text2')} rows={3} className="mt-1" placeholder="Enter Text 2" />
              {errors.text2 && <p className="text-sm text-destructive mt-1">{errors.text2.message}</p>}
            </div>

            <div>
              <Label htmlFor="title3" className="font-semibold">Title 3</Label>
              <Input id="title3" {...register('title3')} className="mt-1" placeholder="Enter Title 3" />
              {errors.title3 && <p className="text-sm text-destructive mt-1">{errors.title3.message}</p>}
            </div>
            <div>
              <Label htmlFor="text3" className="font-semibold">Text 3</Label>
              <Textarea id="text3" {...register('text3')} rows={3} className="mt-1" placeholder="Enter Text 3" />
              {errors.text3 && <p className="text-sm text-destructive mt-1">{errors.text3.message}</p>}
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-3" disabled={isSubmitting}>
              <Save className="mr-2 h-5 w-5" />
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
