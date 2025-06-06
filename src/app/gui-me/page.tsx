// src/app/gui-me/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { VenetianMask } from "lucide-react";
import Image from "next/image";
import type { GuiMeContent } from '@/lib/types';
import { getGuiMeContent } from '@/lib/gui-me-service';
import { Separator } from '@/components/ui/separator';

const PLACEHOLDER_BANNER_GUIME = "https://placehold.co/874x200.png?text=Configure+GUI+Me+Banner";

export default function GuiMePage() {
  const [guiMeData, setGuiMeData] = useState<GuiMeContent | null>(null);

  useEffect(() => {
    setGuiMeData(getGuiMeContent());
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

  const guiMeBannerSrc = guiMeData?.guiMePageBannerUrl && guiMeData.guiMePageBannerUrl.startsWith('http')
    ? guiMeData.guiMePageBannerUrl
    : guiMeData?.guiMePageBannerUrl 
    ? PLACEHOLDER_BANNER_GUIME
    : null;

  return (
    <div className="animate-fade-in space-y-12">
      {guiMeBannerSrc && (
        <div className="relative w-full h-64 md:h-96 rounded-xl overflow-hidden shadow-2xl mb-12 bg-muted/20">
          <Image
            src={guiMeBannerSrc}
            alt="GUI Me Page Banner"
            layout="fill"
            objectFit="contain"
            className="transition-transform duration-500 hover:scale-105"
            data-ai-hint={guiMeBannerSrc === PLACEHOLDER_BANNER_GUIME ? "placeholder" : "design abstract"}
          />
        </div>
      )}

      <Card className="shadow-xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-primary to-accent p-8 text-primary-foreground">
          <div className="flex items-center gap-4">
            <VenetianMask size={48} />
            <div>
              <CardTitle className="text-4xl font-headline">GUI Me: Our Design Philosophy</CardTitle>
              <CardDescription className="text-lg text-primary-foreground/80">
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

          {(guiMeData?.title1 || guiMeData?.text1 || guiMeData?.title2 || guiMeData?.text2 || guiMeData?.title3 || guiMeData?.text3) && <Separator className="my-8" />}

          <p className="text-lg text-foreground/90 leading-relaxed">
            At Fanan Team, we believe that a great VST plugin is not just about powerful sound engines, but also about an enjoyable and efficient user experience. Our "GUI Me" philosophy centers around creating Graphical User Interfaces (GUIs) that are both aesthetically pleasing and highly functional.
          </p>
          
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
