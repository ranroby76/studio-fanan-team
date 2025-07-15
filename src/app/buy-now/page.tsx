// src/app/buy-now/page.tsx
import Image from "next/image";

export default function BuyNowPage() {
  return (
    <div className="container mx-auto px-4 flex justify-center items-center">
      <div className="relative w-full max-w-5xl bg-muted/50 p-4 rounded-xl shadow-inner">
        <div className="relative w-full aspect-[1.78]">
          <Image
            src="/images/A5.jpg"
            alt="Synthesizer background"
            fill
            className="w-full h-full rounded-lg shadow-lg object-cover"
            data-ai-hint="synthesizer futuristic"
            priority
          />
          <div className="absolute inset-0 flex flex-col justify-between items-center p-8">
            <h1 className="text-white font-bold text-6xl md:text-8xl tracking-wider uppercase font-impact" style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.7)' }}>
              Welcome To
            </h1>
            <div className="relative w-full max-w-lg h-1/3">
               <Image
                src="/images/A6.jpg"
                alt="Fanan Store"
                fill
                className="object-contain"
                data-ai-hint="logo text"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
