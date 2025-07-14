// src/app/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { GuiMeContent } from '@/lib/types';
import { getGuiMeContent } from '@/lib/gui-me-service';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

const PLACEHOLDER_BANNER_HOME = "/A2.png";

export default function HomePage() {
  const [guiMeData, setGuiMeData] = useState<GuiMeContent | null>(null);
  const [isLoadingBanner, setIsLoadingBanner] = useState(true);

  useEffect(() => {
    async function loadBannerData() {
      setIsLoadingBanner(true);
      try {
        const data = await getGuiMeContent();
        setGuiMeData(data);
      } catch (error) {
        console.error("Failed to load GUI Me content for homepage banner:", error);
        // Fallback to local defaults is handled by getGuiMeContent,
        // so we can just re-call it to get the default if an error specific to fetching occurs.
         const localDefaults = await getGuiMeContent();
         setGuiMeData(localDefaults);
      } finally {
        setIsLoadingBanner(false);
      }
    }
    loadBannerData();
  }, []);

  const homeBannerSrc = guiMeData?.homePageBannerUrl && (guiMeData.homePageBannerUrl.startsWith('http://') || guiMeData.homePageBannerUrl.startsWith('https://'))
    ? guiMeData.homePageBannerUrl
    : PLACEHOLDER_BANNER_HOME;
    
  const isHomeBannerPng = homeBannerSrc && homeBannerSrc.toLowerCase().endsWith('.png');

  const homeBannerContainerClasses = cn(
    "relative w-full h-64 md:h-96 overflow-hidden bg-muted/20",
    !isHomeBannerPng && "mb-12"
  );

  return (
    <div className="space-y-12 animate-fade-in">
      {isLoadingBanner ? (
        <div className={cn(homeBannerContainerClasses, "flex items-center justify-center rounded-xl shadow-lg")}>
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      ) : homeBannerSrc ? (
        <>
          <Link href="/gui-me" aria-label="Learn more about our GUI design philosophy">
            <section className={homeBannerContainerClasses}>
              <Image
                src={homeBannerSrc}
                alt="Site Banner - GUI Me Design Philosophy"
                fill
                className="object-contain transition-transform duration-500 hover:scale-105"
                data-ai-hint={homeBannerSrc === PLACEHOLDER_BANNER_HOME ? "placeholder" : "promotion website"}
                priority
              />
            </section>
          </Link>
          <div className="my-8 text-center space-y-3 bg-primary/15 p-3 rounded-lg shadow-sm max-w-lg mx-auto">
            <Separator className="bg-border/50" />
            <p className="text-foreground/80">
              New to Fanan Team? Please, always read the{" "}
              <Link href="/how-to-buy" className="text-accent hover:underline font-semibold">
                &quot;how to buy?&quot;
              </Link>{" "}
              instructions before purchasing.
            </p>
            <Separator className="bg-border/50" />
            <p className="text-foreground/80 font-medium">
              New folks, please, Always try the demo first before purchasing. Never buy before first testing a demo on your system.
            </p>
          </div>
        </>
      ) : null}

      <section>
        <h2 className="text-3xl font-headline font-semibold text-center mb-8 text-primary">Featured Products</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((item, index) => (
            <Card key={item} className="overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-1">
              <CardHeader className="p-0">
                <Image
                  src={`https://placehold.co/600x400.png?text=VST+${item}`}
                  alt={`Featured VST ${item}`}
                  width={600}
                  height={400}
                  className="object-cover w-full h-48"
                  data-ai-hint="synthesizer audio"
                  priority={index === 0}
                />
              </CardHeader>
              <CardContent className="pt-6">
                <CardTitle className="font-headline text-xl mb-2 text-primary">Awesome VST {item}</CardTitle>
                <CardDescription className="text-foreground/70 line-clamp-3">
                  A brief description of this amazing VST plugin that will change the way you make music. Experience unparalleled sound quality.
                </CardDescription>
              </CardContent>
              <CardFooter>
                <Button variant="outline" asChild className="w-full border-primary text-primary hover:bg-primary/10">
                  <Link href={`/products/placeholder-${item}`}>
                    Learn More
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
         <div className="text-center mt-8">
            <Button variant="link" asChild className="text-accent text-lg font-headline hover:text-accent/80">
                <Link href="/products">
                    View All Products <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
            </Button>
        </div>
      </section>

      <section className="bg-card p-8 rounded-xl shadow-lg">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1">
            <h2 className="text-3xl font-headline font-semibold text-primary mb-4">Why Choose Fanan Team?</h2>
            <p className="text-foreground/80 mb-3">
              We are dedicated to crafting high-quality, innovative, and affordable VST plugins for musicians and producers of all levels.
            </p>
            <ul className="list-disc list-inside space-y-2 text-foreground/70">
              <li>Unique sound design possibilities.</li>
              <li>Intuitive and user-friendly interfaces.</li>
              <li>Regular updates and dedicated support.</li>
              <li>Great value for exceptional tools.</li>
            </ul>
          </div>
          <div className="flex-1">
            <Image
              src="https://placehold.co/600x400.png"
              alt="Music production"
              width={600}
              height={400}
              className="rounded-lg shadow-md object-cover"
              data-ai-hint="studio music"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
