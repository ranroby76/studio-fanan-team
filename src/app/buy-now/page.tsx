// src/app/buy-now/page.tsx
import Image from "next/image";
import PaypalPayment from "@/components/paypal/PaypalPayment";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HelpCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function BuyNowPage() {
  // A5 dimensions: 1472x832 -> aspect-ratio: 1.768
  // A6 dimensions: 1015x234 -> aspect-ratio: 4.337
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
          <div className="absolute inset-0 flex flex-col justify-between items-center p-8">
            <h1 className="text-white font-bold text-5xl md:text-7xl lg:text-8xl tracking-wider uppercase font-impact" style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.7)' }}>
              Welcome To
            </h1>
            <div className="relative w-full max-w-lg transform scale-150 origin-bottom mb-16" style={{ aspectRatio: '4.337' }}>
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
            <div className="flex flex-col items-center">
                <div className="mb-4 flex items-center justify-center h-[60px]">
                    <Image
                        src="/images/mad midi machines.png"
                        alt="Mad MIDI Machines Pack"
                        width={400}
                        height={60}
                        className="object-contain"
                        data-ai-hint="synthesizer abstract"
                    />
                </div>
                <PaypalPayment price="22.00" title="$22" />
            </div>
            
            <Separator orientation="vertical" className="absolute left-1/2 top-0 h-full -translate-x-1/2 hidden md:block" />

            <div className="flex flex-col items-center">
                <div className="mb-4 flex items-center justify-center h-[60px]">
                    <Image
                        src="/images/pro pack.png"
                        alt="Pro Pack"
                        width={400}
                        height={60}
                        className="object-contain"
                        data-ai-hint="professional audio"
                    />
                </div>
                <PaypalPayment price="12.00" title="$12" />
            </div>
        </div>

        <div className="mt-8">
          <Card className="bg-card/70 shadow-lg border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl font-headline text-primary">
                <HelpCircle className="h-8 w-8" />
                Purchasing Instructions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-foreground/90">
              <ol className="list-decimal list-inside space-y-3 pl-2">
                <li>
                  <strong>Get Your Machine ID:</strong> Download and install any plugin from your desired bundle. Open it in your DAW and click the "REGISTER" button to find your unique Machine ID.
                </li>
                <li>
                  <strong>Complete Your Purchase:</strong> Return to this page and enter your Machine ID into the corresponding text box for your chosen bundle. Click "BUY NOW" to complete the payment.
                </li>
                <li>
                  <strong>Receive Your Serial Number:</strong> After a successful purchase, your serial number will instantly appear in the box above. It will also be sent to your email address for your records.
                </li>
                <li>
                  <strong>Register Your Plugin:</strong> Copy the serial number, paste it into the plugin's registration window back in your DAW, and click "Save". Registering one plugin activates the entire bundle.
                </li>
              </ol>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
