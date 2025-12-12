// src/app/buy-now/page.tsx
"use client";

import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HelpCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";


const PaypalButton = ({ hostedButtonId }: { hostedButtonId: string }) => {
  const formAction = `https://www.paypal.com/ncp/payment/${hostedButtonId}`;
  
  const buttonStyle = {
    textAlign: 'center',
    border: 'none',
    borderRadius: '0.25rem',
    minWidth: '11.625rem',
    padding: '0 2rem',
    height: '2.625rem',
    fontWeight: 'bold',
    backgroundColor: '#FFD140',
    color: '#000000',
    fontFamily: '"Helvetica Neue", Arial, sans-serif',
    fontSize: '1rem',
    lineHeight: '1.25rem',
    cursor: 'pointer',
  } as const;

  const formStyle = {
    display: 'inline-grid',
    justifyItems: 'center',
    alignContent: 'start',
    gap: '0.5rem',
  } as const;

  return (
    <div>
      <form action={formAction} method="post" target="_blank" style={formStyle}>
        <input style={buttonStyle} type="submit" value="Buy Now" />
        <img src="https://www.paypalobjects.com/images/Debit_Credit_APM.svg" alt="cards" />
        <section style={{ fontSize: '0.75rem' }}>
          Powered by <img src="https://www.paypalobjects.com/paypal-ui/logos/svg/paypal-wordmark-color.svg" alt="paypal" style={{ height: '0.875rem', verticalAlign: 'middle' }} />
        </section>
      </form>
    </div>
  );
};


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
                <div className="text-5xl font-bold text-center mb-4 text-primary">$22</div>
                <div className="mt-4 w-full max-w-sm p-2 bg-muted border border-border rounded-md text-center">
                    <label htmlFor="machineId-1" className="text-sm mb-2 text-black dark:text-yellow-300 block">Enter Your Machine ID</label>
                    <Input id="machineId-1" type="text" placeholder="Your unique machine ID..." className="text-center bg-background" />
                    <div className="text-xs text-muted-foreground mt-1">Find this in the plugin's "REGISTER" window.</div>
                </div>
                <PaypalButton hostedButtonId="6QCF2G32QQMGE" />
                <div className="mt-2 w-full max-w-sm p-2 bg-muted border border-border rounded-md text-center">
                    <div className="text-sm mb-2 text-black dark:text-yellow-300">Serial Number</div>
                    <div className="font-bold text-green-600 text-lg min-h-[28px] flex items-center justify-center">
                        <span className="text-muted-foreground/80 italic text-sm">Your serial will be sent to your email</span>
                    </div>
                </div>
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
                <div className="text-5xl font-bold text-center mb-4 text-primary">$12</div>
                 <div className="mt-4 w-full max-w-sm p-2 bg-muted border border-border rounded-md text-center">
                    <label htmlFor="machineId-2" className="text-sm mb-2 text-black dark:text-yellow-300 block">Enter Your Machine ID</label>
                    <Input id="machineId-2" type="text" placeholder="Your unique machine ID..." className="text-center bg-background" />
                    <div className="text-xs text-muted-foreground mt-1">Find this in the plugin's "REGISTER" window.</div>
                </div>
                <PaypalButton hostedButtonId="S68QVFV9UUEZG" />
                 <div className="mt-2 w-full max-w-sm p-2 bg-muted border border-border rounded-md text-center">
                    <div className="text-sm mb-2 text-black dark:text-yellow-300">Serial Number</div>
                    <div className="font-bold text-green-600 text-lg min-h-[28px] flex items-center justify-center">
                        <span className="text-muted-foreground/80 italic text-sm">Your serial will be sent to your email</span>
                    </div>
                </div>
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
