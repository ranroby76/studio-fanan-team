
// src/app/gui-me/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { VenetianMask, Loader2 } from "lucide-react";
import Image from "next/image";
import type { GuiMeContent } from '@/lib/types';
import { getGuiMeContent } from '@/lib/gui-me-service';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

export default function GuiMePage() {
  const [guiMeData, setGuiMeData] = useState<GuiMeContent | null>(null);
  const [isLoadingContent, setIsLoadingContent] = useState(true);

  useEffect(() => {
    async function loadContent() {
      setIsLoadingContent(true);
      try {
        const data = await getGuiMeContent();
        setGuiMeData(data);
      } catch (error) {
        console.error("Failed to load GUI Me content:", error);
        // Fallback to local defaults is handled by getGuiMeContent
        const localDefaults = await getGuiMeContent();
        setGuiMeData(localDefaults);
      } finally {
        setIsLoadingContent(false);
      }
    }
    loadContent();
  }, []);

  const renderTextSection = (title?: string, text?: string) => {
    if (!title && !text) return null;
    return (
      <div className="mb-6">
        {title && <h2 className="text-3xl font-headline text-primary mb-2">{title}</h2>}
        {text && <p className="text-lg text-foreground/80 leading-relaxed whitespace-pre-line">{text}</p>}
      </div>
    );
  };

  const guiMeBannerSrc = guiMeData?.guiMePageBannerUrl && (guiMeData.guiMePageBannerUrl.startsWith('http://') || guiMeData.guiMePageBannerUrl.startsWith('https://'))
    ? guiMeData.guiMePageBannerUrl
    : "/A2.png";

  if (isLoadingContent) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg text-muted-foreground">Loading GUI Me page...</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-12">
      {guiMeBannerSrc && (
         <div className="mb-12">
            <Image
              src={guiMeBannerSrc}
              alt="GUI Me Page Banner"
              width={1405}
              height={669}
              className="w-full h-auto rounded-lg shadow-lg object-contain"
              data-ai-hint={guiMeBannerSrc === "/A2.png" ? "promotion website" : "design abstract"}
              priority
            />
        </div>
      )}

      <Card className="shadow-xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-primary to-accent p-8 text-primary-foreground">
          <div className="flex items-center gap-4">
            <VenetianMask size={48} />
            <div>
              <h1 className="text-4xl font-headline font-semibold leading-none tracking-tight">GUI Me: Our Design Philosophy</h1>
              <p className="text-lg text-primary-foreground/80 mt-2">
                Crafting intuitive and inspiring user interfaces for your creative flow.
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-8 space-y-6">
          {renderTextSection(guiMeData?.title1, guiMeData?.text1)}
          { (guiMeData?.title1 || guiMeData?.text1) && (guiMeData?.title2 || guiMeData?.text2 || guiMeData?.title3 || guiMeData?.text3) && <Separator className="my-8" />}
          
          {renderTextSection(guiMeData?.title2, guiMeData?.text2)}
          { (guiMeData?.title2 || guiMeData?.text2) && (guiMeData?.title3 || guiMeData?.text3) && <Separator className="my-8" />}

          {renderTextSection(guiMeData?.title3, guiMeData?.text3)}

          {(!guiMeData?.title1 && !guiMeData?.text1 && !guiMeData?.title2 && !guiMeData?.text2 && !guiMeData?.title3 && !guiMeData?.text3) && (
            <p className="text-lg text-foreground/90 leading-relaxed">
              At Fanan Team, we believe that a great VST plugin is not just about powerful sound engines, but also about an enjoyable and efficient user experience. Our "GUI Me" philosophy centers around creating Graphical User Interfaces (GUIs) that are both aesthetically pleasing and highly functional. This content can be updated in the management section.
            </p>
          )}
          
          <Separator className="my-8" />

          <div>
            <h2 className="text-2xl font-headline text-primary mb-3">Interested in our GUI Design Services?</h2>
            <p className="text-lg text-foreground/80 leading-relaxed mb-2">
              If you'd like us to design a custom GUI for your audio plugin or software, we'd love to hear from you!
            </p>
            <p className="text-lg text-foreground/80 leading-relaxed">
              Please contact us at: <a href="mailto:fanantem@gmail.com" className="font-semibold text-accent hover:underline">fanantem@gmail.com</a> to discuss your project requirements and how we can help bring your vision to life.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
