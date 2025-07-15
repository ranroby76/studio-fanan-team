// src/app/gui-me/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { VenetianMask, Info, Loader2 } from "lucide-react";
import Image from "next/image";
import type { GuiMeContent } from '@/lib/types';
import { getGuiMeContent } from '@/lib/gui-me-service';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

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
        setGuiMeData({ title1: '', text1: '', title2: '', text2: '', title3: '', text3: '' });
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
  
  const noContent = !isLoadingContent && (!guiMeData || (!guiMeData.title1 && !guiMeData.text1 && !guiMeData.title2 && !guiMeData.text2 && !guiMeData.title3 && !guiMeData.text3));

  return (
    <div className="container mx-auto px-4">
      <div className="animate-fade-in space-y-12">
        <div className="mb-12">
          <Image
            src="/images/A1.png"
            alt="GUI Me Page Banner"
            width={1405}
            height={669}
            className="w-full h-auto rounded-lg shadow-lg object-contain"
            data-ai-hint="design abstract"
            priority
          />
        </div>

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
            {isLoadingContent ? (
              <div className="flex flex-col items-center justify-center py-10">
                <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                <p className="text-muted-foreground">Loading content...</p>
              </div>
            ) : (
              <>
                {renderTextSection(guiMeData?.title1, guiMeData?.text1)}
                { (guiMeData?.title1 || guiMeData?.text1) && (guiMeData?.title2 || guiMeData?.text2 || guiMeData?.title3 || guiMeData?.text3) && <Separator className="my-8" />}
                
                {renderTextSection(guiMeData?.title2, guiMeData?.text2)}
                { (guiMeData?.title2 || guiMeData?.text2) && (guiMeData?.title3 || guiMeData?.text3) && <Separator className="my-8" />}

                {renderTextSection(guiMeData?.title3, guiMeData?.text3)}

                {noContent && (
                   <div className="text-center py-10 bg-muted/50 rounded-lg">
                      <Info className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-xl font-semibold text-primary">Content Coming Soon</h3>
                      <p className="text-muted-foreground mt-2">
                          This section is waiting for content. Please check back later or add content in the management area.
                      </p>
                  </div>
                )}
              </>
            )}
            
            <Separator className="my-8" />

            <div>
              <h2 className="text-2xl font-headline text-primary mb-3">Feedback & Questions</h2>
              <p className="text-lg text-foreground/80 leading-relaxed mb-2">
                We'd love to hear from you! Feel free to write to us about anything—whether you have feedback, questions, or just want to say hello.
              </p>
              <p className="text-lg text-foreground/80 leading-relaxed">
                You can reach us at: <a href="mailto:fananteam@gmail.com" className="font-semibold text-accent hover:underline">fananteam@gmail.com</a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
