// src/app/manage/gui-me-editor/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Palette, Save, Loader2, ClipboardCopy } from 'lucide-react';
import type { GuiMeContentFormData } from '@/lib/types';
import { getGuiMeContent, generateGuiMeJsonString } from '@/lib/gui-me-service';
import Image from 'next/image';

const guiMeFormSchema = z.object({
  title1: z.string().optional(),
  text1: z.string().optional(),
  title2: z.string().optional(),
  text2: z.string().optional(),
  title3: z.string().optional(),
  text3: z.string().optional(),
});

export default function GuiMeEditorPage() {
  const { toast } = useToast();
  const [isLoadingContent, setIsLoadingContent] = useState(true);
  const [jsonOutput, setJsonOutput] = useState('');

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<GuiMeContentFormData>({
    resolver: zodResolver(guiMeFormSchema),
    defaultValues: {
      title1: '',
      text1: '',
      title2: '',
      text2: '',
      title3: '',
      text3: '',
    },
  });

  useEffect(() => {
    async function loadContent() {
      setIsLoadingContent(true);
      try {
        const currentContent = await getGuiMeContent();
        reset(currentContent);
      } catch (error) {
        console.error("Failed to load GUI Me content:", error);
        toast({
          title: 'Error Loading Content',
          description: 'Could not fetch GUI Me content from JSON file.',
          variant: 'destructive',
        });
      } finally {
        setIsLoadingContent(false);
      }
    }
    loadContent();
  }, [reset, toast]);

  const onSubmit: SubmitHandler<GuiMeContentFormData> = async (data) => {
    try {
      const jsonString = generateGuiMeJsonString(data);
      setJsonOutput(jsonString);
      toast({
        title: 'JSON Generated!',
        description: 'Copy the JSON content below and paste it into src/data/gui-me-content.json.',
        variant: 'default',
      });
    } catch (error) {
      console.error("Error generating JSON:", error);
      toast({
        title: 'Generation Failed',
        description: 'Could not generate JSON. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonOutput);
    toast({ title: 'Copied to clipboard!' });
  };

  if (isLoadingContent) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-muted-foreground">Loading content editor...</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-4">
      <Card className="shadow-xl w-full max-w-3xl mx-auto">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <Palette className="h-10 w-10 text-primary" />
            <CardTitle className="text-4xl font-headline text-primary">GUI ME Content Editor</CardTitle>
          </div>
          <CardDescription className="text-lg text-foreground/80">
            Manage the dynamic text content for the GUI Me page. After generating, copy the JSON to `src/data/gui-me-content.json`.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <h3 className="text-xl font-headline text-primary">GUI Me Page Text Sections</h3>
            
            <div>
              <Label htmlFor="title1" className="font-semibold">Title 1</Label>
              <Input id="title1" {...register('title1')} className="mt-1" placeholder="Enter Title 1" />
              {errors.title1 && <p className="text-sm text-destructive mt-1">{errors.title1.message}</p>}
            </div>
            <div>
              <Label htmlFor="text1" className="font-semibold">Text 1</Label>
              <Textarea id="text1" {...register('text1')} rows={5} className="mt-1" placeholder="Enter Text 1" />
              {errors.text1 && <p className="text-sm text-destructive mt-1">{errors.text1.message}</p>}
            </div>

            <div>
              <Label htmlFor="title2" className="font-semibold">Title 2</Label>
              <Input id="title2" {...register('title2')} className="mt-1" placeholder="Enter Title 2" />
              {errors.title2 && <p className="text-sm text-destructive mt-1">{errors.title2.message}</p>}
            </div>
            <div>
              <Label htmlFor="text2" className="font-semibold">Text 2</Label>
              <Textarea id="text2" {...register('text2')} rows={5} className="mt-1" placeholder="Enter Text 2" />
              {errors.text2 && <p className="text-sm text-destructive mt-1">{errors.text2.message}</p>}
            </div>

            <div>
              <Label htmlFor="title3" className="font-semibold">Title 3</Label>
              <Input id="title3" {...register('title3')} className="mt-1" placeholder="Enter Title 3" />
              {errors.title3 && <p className="text-sm text-destructive mt-1">{errors.title3.message}</p>}
            </div>
            <div>
              <Label htmlFor="text3" className="font-semibold">Text 3</Label>
              <Textarea id="text3" {...register('text3')} rows={5} className="mt-1" placeholder="Enter Text 3" />
              {errors.text3 && <p className="text-sm text-destructive mt-1">{errors.text3.message}</p>}
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-3" disabled={isSubmitting || isLoadingContent}>
              {isSubmitting ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Save className="mr-2 h-5 w-5" />}
              {isSubmitting ? 'Generating...' : 'Generate JSON'}
            </Button>
          </CardFooter>
        </form>
      </Card>

       {jsonOutput && (
        <Card className="shadow-xl w-full max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle>Generated JSON Output</CardTitle>
            <CardDescription>Copy this content into `src/data/gui-me-content.json` and save the file.</CardDescription>
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
              className="absolute top-16 right-5 text-muted-foreground"
              onClick={handleCopy}
            >
              <ClipboardCopy className="h-5 w-5" />
            </Button>
          </CardContent>
        </Card>
      )}

       <Card className="shadow-xl w-full max-w-3xl mx-auto">
        <CardHeader>
            <CardTitle className="font-headline text-primary">Static Page Images</CardTitle>
            <CardDescription>These images are part of the page layout and not editable here.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div>
            <Label className="font-semibold text-muted-foreground">Home Page Banner (A2.png)</Label>
            <div className="mt-2 rounded-lg border p-2">
                <Image src="/images/A2.png" alt="Home Page Banner Preview" width={800} height={200} className="w-full h-auto rounded-md object-contain" />
            </div>
            </div>
            <div>
            <Label className="font-semibold text-muted-foreground">GUI Me Page Banner (A1.png)</Label>
            <div className="mt-2 rounded-lg border p-2">
                <Image src="/images/A1.png" alt="GUI Me Page Banner Preview" width={800} height={400} className="w-full h-auto rounded-md object-contain" />
            </div>
            </div>
        </CardContent>
       </Card>

    </div>
  );
}
