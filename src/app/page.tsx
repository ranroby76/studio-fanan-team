// src/app/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { GuiMeContent } from '@/lib/types';
import { getGuiMeContent } from '@/lib/gui-me-service';

const PLACEHOLDER_BANNER_HOME = "https://placehold.co/1200x400.png?text=Configure+Banner";

export default function HomePage() {
  const [guiMeData, setGuiMeData] = useState<GuiMeContent | null>(null);

  useEffect(() => {
    setGuiMeData(getGuiMeContent());
  }, []);

  const homeBannerSrc = guiMeData?.homePageBannerUrl && guiMeData.homePageBannerUrl.startsWith('http')
    ? guiMeData.homePageBannerUrl
    : guiMeData?.homePageBannerUrl // Only use placeholder if URL exists but is invalid, otherwise don't render
    ? PLACEHOLDER_BANNER_HOME
    : null;


  return (
    <div className="space-y-12 animate-fade-in">
      {homeBannerSrc && (
        <section className="mb-12 relative w-full h-64 md:h-80 rounded-xl overflow-hidden shadow-lg">
          <Image
            src={homeBannerSrc}
            alt="Site Banner"
            layout="fill"
            objectFit="cover"
            className="transition-transform duration-500 hover:scale-105"
            data-ai-hint={homeBannerSrc === PLACEHOLDER_BANNER_HOME ? "placeholder" : "promotion website"}
          />
        </section>
      )}

      <section className="text-center py-12 bg-gradient-to-br from-primary/10 via-background to-accent/10 rounded-xl shadow-lg p-8">
        <h1 className="text-5xl font-headline font-bold text-primary mb-6 animate-slide-in-from-bottom [animation-delay:0.2s]">
          Welcome to Fanan Team Hub
        </h1>
        <p className="text-xl text-foreground/80 max-w-2xl mx-auto mb-8 animate-slide-in-from-bottom [animation-delay:0.4s]">
          Discover our innovative VST instruments and audio plugins, designed to inspire your creativity and elevate your sound.
        </p>
        <div className="animate-slide-in-from-bottom [animation-delay:0.6s]">
          <Button size="lg" asChild className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg transform hover:scale-105 transition-transform duration-300">
            <Link href="/products">
              Explore Products <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      <section>
        <h2 className="text-3xl font-headline font-semibold text-center mb-8 text-primary">Featured Products</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((item) => (
            <Card key={item} className="overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-1">
              <CardHeader className="p-0">
                <Image
                  src={`https://placehold.co/600x400.png?text=VST+${item}`}
                  alt={`Featured VST ${item}`}
                  width={600}
                  height={400}
                  className="object-cover w-full h-48"
                  data-ai-hint="synthesizer audio"
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
