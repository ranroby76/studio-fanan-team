// src/app/manage/logos/page.tsx
"use client";

import { useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ImageIcon, Save } from 'lucide-react';
import type { FirmLogosFormData } from '@/lib/types';
import { getLogosContent, saveLogosContent } from '@/lib/logo-service';

const logosFormSchema = z.object({
  firmLogoUrl: z.string().url("Must be a valid URL or empty").or(z.literal('')).optional(),
  proPackLogoUrl: z.string().url("Must be a valid URL or empty").or(z.literal('')).optional(),
  madMidiMachinesLogoUrl: z.string().url("Must be a valid URL or empty").or(z.literal('')).optional(),
  royalPackLogoUrl: z.string().url("Must be a valid URL or empty").or(z.literal('')).optional(),
  freePackLogoUrl: z.string().url("Must be a valid URL or empty").or(z.literal('')).optional(),
});

interface LogoField {
  id: keyof FirmLogosFormData;
  label: string;
  placeholder: string;
}

const logoFields: LogoField[] = [
  { id: 'firmLogoUrl', label: 'Firm Logo URL', placeholder: 'https://firebasestorage.googleapis.com/...' },
  { id: 'proPackLogoUrl', label: 'Pro Pack Logo URL', placeholder: 'https://firebasestorage.googleapis.com/...' },
  { id: 'madMidiMachinesLogoUrl', label: 'Mad MIDI Machines Logo URL', placeholder: 'https://firebasestorage.googleapis.com/...' },
  { id: 'royalPackLogoUrl', label: 'Royal Pack Logo URL', placeholder: 'https://firebasestorage.googleapis.com/...' },
  { id: 'freePackLogoUrl', label: 'Free Pack Logo URL', placeholder: 'https://firebasestorage.googleapis.com/...' },
];

export default function LogosEditorPage() {
  const { toast } = useToast();
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<FirmLogosFormData>({
    resolver: zodResolver(logosFormSchema),
    defaultValues: {
      firmLogoUrl: '',
      proPackLogoUrl: '',
      madMidiMachinesLogoUrl: '',
      royalPackLogoUrl: '',
      freePackLogoUrl: '',
    },
  });

  useEffect(() => {
    const currentContent = getLogosContent();
    if (currentContent) {
      reset(currentContent);
    }
  }, [reset]);

  const onSubmit: SubmitHandler<FirmLogosFormData> = async (data) => {
    try {
      saveLogosContent(data);
      toast({
        title: 'Logos Saved!',
        description: 'Your firm logo URLs have been updated.',
      });
    } catch (error) {
      console.error("Error saving Logos content:", error);
      toast({
        title: 'Error',
        description: 'Failed to save logo URLs. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="animate-fade-in">
      <Card className="shadow-xl w-full max-w-3xl mx-auto">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <ImageIcon className="h-10 w-10 text-primary" />
            <CardTitle className="text-4xl font-headline text-primary">Manage Logos</CardTitle>
          </div>
          <CardDescription className="text-lg text-foreground/80">
            Update the URLs for various company and product pack logos.
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
                  Please use the full HTTPS download URL (e.g., from Firebase Storage).
                </p>
                {errors[field.id] && <p className="text-sm text-destructive mt-1">{errors[field.id]?.message}</p>}
              </div>
            ))}
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-3" disabled={isSubmitting}>
              <Save className="mr-2 h-5 w-5" />
              {isSubmitting ? 'Saving...' : 'Save Logo URLs'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
