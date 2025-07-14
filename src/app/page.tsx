// src/app/page.tsx
"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Separator } from '@/components/ui/separator';

export default function HomePage() {
  return (
    <div className="space-y-12 animate-fade-in">
      <div className="bg-primary/10">
        <div className="container mx-auto px-4 text-center space-y-3 py-3 rounded-lg shadow-sm">
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
      </div>
      
      <Link href="/gui-me" aria-label="Learn more about our GUI design philosophy" className="block container mx-auto px-4">
        <section className="relative w-full max-w-3xl mx-auto h-auto overflow-hidden bg-muted/20 rounded-lg shadow-lg">
          <Image
            src="/images/A2.png"
            alt="Site Banner - GUI Me Design Philosophy"
            width={1405}
            height={669}
            className="object-contain w-full h-auto transition-transform duration-500 hover:scale-105"
            data-ai-hint="design abstract"
            priority
          />
        </section>
      </Link>
      
      <div className="container mx-auto px-4">
        <section className="bg-card p-8 rounded-xl shadow-lg mt-16">
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
               <div className="text-center md:text-left mt-8">
                  <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-md hover:shadow-lg">
                      <Link href="/products">
                          View All Products <ArrowRight className="ml-2 h-5 w-5" />
                      </Link>
                  </Button>
              </div>
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
    </div>
  );
}
