// src/app/gui-me/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { VenetianMask, Loader2 } from "lucide-react";
import Image from "next/image";
import type { GuiMeContent } from '@/lib/types';
import { getGuiMeContent } from '@/lib/gui-me-service';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

const PLACEHOLDER_BANNER_GUIME = "/A2.png";

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
    : PLACEHOLDER_BANNER_GUIME;
    
  const guiMeBannerContainerClasses = cn(
    "relative w-full h-64 md:h-96 overflow-hidden bg-muted/20 mb-12"
  );


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
        <div className={guiMeBannerContainerClasses}>
          <Image
            src={guiMeBannerSrc}
            alt="GUI Me Page Banner"
            fill
            className="object-contain transition-transform duration-500"
            data-ai-hint={guiMeBannerSrc === PLACEHOLDER_BANNER_GUIME ? "promotion website" : "design abstract"}
            priority
          />
        </div>
      )}

      <Card className="shadow-xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-primary to-accent p-8 text-primary-foreground">
          <div className="flex items-center gap-4">
            <VenetianMask size={48} />
            <div>
              <CardTitle as="h1" className="text-4xl font-headline">GUI Me: Our Design Philosophy</CardTitle>
              <CardDescription as="p" className="text-lg text-primary-foreground/80">
                Crafting intuitive and inspiring user interfaces for your creative flow.
              </CardDescription>
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
            <h3 className="text-2xl font-headline text-primary mb-3">Interested in our GUI Design Services?</h3>
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
