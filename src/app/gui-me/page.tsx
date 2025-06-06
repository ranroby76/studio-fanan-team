// src/app/gui-me/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { VenetianMask, Eye, Palette, MousePointerSquareDashed } from "lucide-react";
import Image from "next/image";
import type { GuiMeContent } from '@/lib/types';
import { getGuiMeContent } from '@/lib/gui-me-service';
import { Separator } from '@/components/ui/separator';

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

  return (
    <div className="animate-fade-in space-y-12">
      {guiMeData?.guiMePageBannerUrl && (
        <div className="relative w-full h-64 md:h-96 rounded-xl overflow-hidden shadow-2xl mb-12">
          <Image
            src={guiMeData.guiMePageBannerUrl}
            alt="GUI Me Page Banner"
            layout="fill"
            objectFit="cover"
            className="transition-transform duration-500 hover:scale-105"
            data-ai-hint="design abstract"
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

          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-headline text-primary mb-3">Key Principles:</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <Eye className="h-6 w-6 text-accent mt-1 shrink-0" />
                  <span className="text-foreground/80">
                    <strong className="font-semibold text-foreground">Clarity & Readability:</strong> Easy-to-understand layouts with clear labeling and visual hierarchy. No more guessing what a knob does!
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Palette className="h-6 w-6 text-accent mt-1 shrink-0" />
                  <span className="text-foreground/80">
                    <strong className="font-semibold text-foreground">Aesthetic Appeal:</strong> Visually engaging designs that inspire creativity without being distracting. We aim for a modern, clean look.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <MousePointerSquareDashed className="h-6 w-6 text-accent mt-1 shrink-0" />
                  <span className="text-foreground/80">
                    <strong className="font-semibold text-foreground">Workflow Efficiency:</strong> Logically grouped controls and intuitive navigation to speed up your sound design process.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-accent mt-1 shrink-0 lucide lucide-scaling"><path d="M21.5 7.5v5.5a4 4 0 0 1-4 4H7.5a4 4 0 0 1-4-4v-5a4 4 0 0 1 4-4h5"/><path d="M15 3.5V9h5.5"/><path d="M12 12H4M12 12V4M12 12l7.5 7.5"/></svg>
                  <span className="text-foreground/80">
                    <strong className="font-semibold text-foreground">Scalability & Responsiveness:</strong> GUIs that adapt to different screen sizes and resolutions, ensuring a comfortable experience on any setup.
                  </span>
                </li>
              </ul>
            </div>
            <div className="flex justify-center">
              <Image 
                src="https://placehold.co/500x350.png" 
                alt="Example of a VST GUI" 
                width={500} 
                height={350} 
                className="rounded-lg shadow-lg object-cover"
                data-ai-hint="software interface" 
              />
            </div>
          </div>

          <p className="text-lg text-foreground/90 leading-relaxed">
            We're constantly refining our approach, incorporating user feedback, and exploring new design trends to make our plugins not just tools, but true extensions of your musical imagination. If you have suggestions or feedback on our GUIs, please don't hesitate to <a href="/contact-us" className="text-accent hover:underline font-semibold">contact us</a>!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
