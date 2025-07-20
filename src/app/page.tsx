// src/app/page.tsx
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";

export default function HomePage() {
  return (
    <div className="space-y-12 animate-fade-in">

      <section className="relative flex justify-center w-full mx-auto">
        <div className="w-full">
          <Image
            src="/images/SITE TOP.png"
            alt="Site Top Banner"
            width={1846}
            height={739}
            className="object-contain w-full h-auto"
            data-ai-hint="site banner abstract"
            priority
          />
        </div>
      </section>
      
      <section className="container mx-auto px-4 text-center">
        <div className="bg-secondary/50 p-6 rounded-lg shadow-md border border-secondary">
          <p className="text-lg font-semibold text-secondary-foreground">
             New to fanan team? Please, always read the "how to buy?" instructions before purchasing
          </p>
          <p className="text-md mt-2 text-secondary-foreground/80">
            New folks, please, Always try the demo first before purchasing. Never buy before first testing a demo on your system
          </p>
        </div>
      </section>

      <section className="w-full py-4 bg-gradient-to-r from-green-200 via-yellow-200 to-orange-200">
        <div className="container mx-auto px-4">
           <div className="flex justify-between items-center">
            <Image 
              src="/images/A4.png" 
              alt="Promo graphic" 
              width={160} 
              height={160} 
              className="hidden sm:block object-contain"
              data-ai-hint="decorative graphic" 
            />
            <h2 className="text-3xl font-headline font-bold text-slate-800 tracking-wider uppercase text-center px-4">
              WE BELIEVE EVERY SEASON IS SALES SEASON
            </h2>
            <Image 
              src="/images/A4.png" 
              alt="Promo graphic" 
              width={160} 
              height={160} 
              className="hidden sm:block object-contain"
              data-ai-hint="decorative graphic"
            />
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-headline font-semibold text-primary">Our Plugins Packs</h2>
      </div>
      
      <div className="container mx-auto px-4">
        <div className="space-y-8 flex flex-col items-center">
            <Link href="/mad-midi-machine-pack" className="block group">
                <Image
                    src="/images/mad midi machines.png"
                    alt="Mad MIDI Machines Pack"
                    width={700}
                    height={104}
                    className="h-auto rounded-lg shadow-lg object-contain transition-transform duration-300 group-hover:scale-[1.02]"
                    data-ai-hint="synthesizer abstract"
                />
            </Link>
            <Link href="/max-pack" className="block group">
                <Image
                    src="/images/pro pack.png"
                    alt="Max! Pack"
                    width={700}
                    height={142}
                    className="w-full h-auto rounded-lg shadow-lg object-contain transition-transform duration-300 group-hover:scale-[1.02]"
                    data-ai-hint="professional audio"
                />
            </Link>
             <Link href="/free-pack" className="block group w-10/12 md:w-auto">
                <Image
                    src="/images/free pack.png"
                    alt="Free Pack"
                    width={560}
                    height={114}
                    className="h-auto w-full rounded-lg shadow-lg object-contain transition-transform duration-300 group-hover:scale-[1.02]"
                    data-ai-hint="gift box"
                />
            </Link>
        </div>
      </div>
      
      <div className="container mx-auto px-4">
        <Separator className="my-8" />
      </div>

      <section className="container mx-auto px-4 pt-8 text-center">
        <Link href="/gui-me" className="block group">
          <div className="w-full max-w-4xl mx-auto">
            <Image
              src="/images/A2.png"
              alt="Site Banner - GUI Me Design Philosophy"
              width={1406}
              height={670}
              className="object-contain w-full h-auto shadow-lg rounded-lg transition-transform duration-300 group-hover:scale-[1.05]"
              data-ai-hint="design abstract"
            />
          </div>
        </Link>
      </section>

    </div>
  );
}
