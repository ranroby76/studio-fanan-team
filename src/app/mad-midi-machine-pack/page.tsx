// src/app/mad-midi-machine-pack/page.tsx
"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Music } from 'lucide-react';
import type { FirmLogosData } from '@/lib/types';
import { getLogosContent } from '@/lib/logo-service';

export default function MadMidiMachinePackPage() {
  const [logoData, setLogoData] = useState<FirmLogosData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadLogos() {
      try {
        const logos = await getLogosContent();
        setLogoData(logos);
      } catch (error) {
        console.error("Failed to load logo:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadLogos();
  }, []);

  const logoUrl = logoData?.madMidiMachinesLogoUrl ? `/images/${logoData.madMidiMachinesLogoUrl}` : "https://placehold.co/1200x400.png?text=Mad+MIDI+Machines";

  return (
    <div className="container mx-auto px-4">
      <Card className="shadow-xl text-center">
        <CardHeader>
          <Music className="mx-auto h-12 w-12 text-primary mb-4" />
          <CardTitle className="text-4xl font-headline text-primary">Mad MIDI Machines Pack</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-16 w-16 animate-spin text-primary" />
            </div>
          ) : (
            <div className="relative w-full max-w-4xl mx-auto h-auto aspect-[3/1] overflow-hidden bg-muted/20 rounded-lg shadow-lg">
              <Image
                src={logoUrl}
                alt="Mad MIDI Machines Pack"
                fill
                className="object-contain"
                data-ai-hint="synthesizer abstract"
              />
            </div>
          )}
          <div className="mt-8">
            <p className="text-lg text-foreground/80">Products in this pack will be listed here.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
