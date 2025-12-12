// src/app/buy-now/page.tsx
"use client";

import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import PaypalButton from "@/components/paypal/PaypalButton";


export default function BuyNowPage() {
  return (
    <div className="container mx-auto px-4 flex justify-center items-center">
      <div className="relative w-full max-w-5xl bg-muted/50 p-4 rounded-xl shadow-inner">
        <div className="relative w-full" style={{ aspectRatio: '1.768' }}>
          <Image
            src="/images/A5.jpg"
            alt="Synthesizer background"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="w-full h-full rounded-lg shadow-lg object-cover"
            data-ai-hint="synthesizer futuristic"
            priority
          />
          <div className="absolute inset-0 flex flex-col justify-start items-center p-8">
            <h1 className="text-white font-bold text-4xl md:text-5xl lg:text-6xl tracking-wider uppercase font-impact pt-12" style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.7)' }}>
              Welcome To
            </h1>
            <div className="relative w-full max-w-lg mt-auto pb-12" style={{ aspectRatio: '4.337' }}>
               <Image
                src="/images/A6.png"
                alt="Fanan Store"
                fill
                sizes="(max-width: 512px) 100vw, 512px"
                className="object-contain"
                data-ai-hint="logo text"
              />
            </div>
          </div>
        </div>

        <Separator className="my-6" />

        <div className="relative grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <div className="flex flex-col items-center gap-4">
                <div className="flex items-center justify-center h-[60px]">
                    <Image
                        src="/images/mad midi machines.png"
                        alt="Mad MIDI Machines Pack"
                        width={400}
                        height={60}
                        className="object-contain h-full w-auto"
                        data-ai-hint="synthesizer abstract"
                    />
                </div>
                <PaypalButton hostedButtonId="mad-midi-pack" price="0.20" />
            </div>
            
            <Separator orientation="vertical" className="absolute left-1/2 top-0 h-full -translate-x-1/2 hidden md:block" />

            <div className="flex flex-col items-center gap-4">
                <div className="flex items-center justify-center h-[60px]">
                    <Image
                        src="/images/pro pack.png"
                        alt="Pro Pack"
                        width={400}
                        height={60}
                        className="object-contain h-full w-auto"
                        data-ai-hint="professional audio"
                    />
                </div>
                <PaypalButton hostedButtonId="pro-pack" price="12.00" />
            </div>
        </div>

        <div className="mt-8">
            {/* The Purchasing Instructions card is now part of the how-to-buy page, keeping this page clean. */}
        </div>
      </div>
    </div>
  );
}
