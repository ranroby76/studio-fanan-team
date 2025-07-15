// src/app/manage/logos/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ImageIcon, Save, Loader2, ClipboardCopy } from 'lucide-react';
import type { FirmLogosFormData } from '@/lib/types';
import { getLogosContent, generateLogosJsonString } from '@/lib/logo-service';
import { Textarea } from '@/components/ui/textarea';

const logosFormSchema = z.object({
  firmLogoUrl: z.string().optional(),
  proPackLogoUrl: z.string().optional(),
  madMidiMachinesLogoUrl: z.string().optional(),
  freePackLogoUrl: z.string().optional(),
});

interface LogoField {
  id: keyof FirmLogosFormData;
  label: string;
  placeholder: string;
}

const logoFields: LogoField[] = [
  { id: 'firmLogoUrl', label: 'Firm Logo Filename', placeholder: 'firm-logo.png' },
  { id: 'proPackLogoUrl', label: 'Pro Pack Logo Filename', placeholder: 'pro-pack-logo.png' },
  { id: 'madMidiMachinesLogoUrl', label: 'Mad MIDI Machines Logo Filename', placeholder: 'mad-midi-logo.png' },
  { id: 'freePackLogoUrl', label: 'Free Pack Logo Filename', placeholder: 'free-pack-logo.png' },
];

export default function LogosEditorPage() {
  const { toast } = useToast();
  const [isLoadingContent, setIsLoadingContent] = useState(true);
  const [jsonOutput, setJsonOutput] = useState('');
  
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<FirmLogosFormData>({
    resolver: zodResolver(logosFormSchema),
  });

  useEffect(() => {
    async function loadContent() {
      setIsLoadingContent(true);
      try {
        const currentContent = await getLogosContent();
        if (currentContent) {
          reset(currentContent);
        }
      } catch (error) {
        console.error("Failed to load Logos content:", error);
        toast({
          title: 'Error Loading Filenames',
          description: 'Could not fetch logo filenames from JSON file.',
          variant: 'destructive',
        });
      } finally {
        setIsLoadingContent(false);
      }
    }
    loadContent();
  }, [reset, toast]);

  const onSubmit: SubmitHandler<FirmLogosFormData> = async (data) => {
    try {
      const jsonString = generateLogosJsonString(data);
      setJsonOutput(jsonString);
      toast({
        title: 'JSON Generated!',
        description: 'Copy the JSON content below and paste it into src/data/logos-content.json.',
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
        <p className="ml-4 text-muted-foreground">Loading logo editor...</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-4">
      <Card className="shadow-xl w-full max-w-3xl mx-auto">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <ImageIcon className="h-10 w-10 text-primary" />
            <CardTitle className="text-4xl font-headline text-primary">Manage Logos</CardTitle>
          </div>
          <CardDescription className="text-lg text-foreground/80">
            Update the filenames for various logos. The images must be in `public/images/`.
            After saving, copy the generated JSON to `src/data/logos-content.json`.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            {logoFields.map((field) => (
              <div key={field.id}>
                <Label htmlFor={field.id} className="font-semibold">{field.label}</Label>
                <Input 
                  id={field.id} 
                  {...register(field.id)} 
                  className="mt-1" 
                  placeholder={field.placeholder} 
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Enter the exact filename, e.g., `logo.png`.
                </p>
                {errors[field.id] && <p className="text-sm text-destructive mt-1">{errors[field.id]?.message}</p>}
              </div>
            ))}
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
            <CardDescription>Copy this content into `src/data/logos-content.json` and save the file.</CardDescription>
          </CardHeader>
          <CardContent className="relative">
            <Textarea
              readOnly
              value={jsonOutput}
              className="h-48 font-mono text-sm bg-muted"
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
