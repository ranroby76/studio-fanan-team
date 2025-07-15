// src/app/buy-now/page.tsx
import Image from "next/image";

export default function BuyNowPage() {
  return (
    <div className="container mx-auto px-4 flex justify-center items-center">
      <div className="w-full max-w-5xl bg-muted/50 p-4 rounded-xl shadow-inner">
        <Image
          src="/images/A5.jpg"
          alt="Buy Now Information"
          width={1200}
          height={800}
          className="w-full h-auto rounded-lg shadow-lg object-contain"
          data-ai-hint="payment instructions"
          priority
        />
      </div>
    </div>
  );
}
