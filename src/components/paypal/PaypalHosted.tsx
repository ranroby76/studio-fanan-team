// src/components/paypal/PaypalHosted.tsx
"use client";

import { useEffect } from 'react';
import Script from 'next/script';

interface PaypalHostedProps {
  hostedButtonId: string;
  price: string;
}

const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "";

export default function PaypalHosted({ hostedButtonId, price }: PaypalHostedProps) {
  useEffect(() => {
    // This effect ensures the PayPal button gets re-rendered when the component mounts or props change.
    // The PayPal SDK script scans the document for elements with the data-hosted-button-id attribute.
    // @ts-ignore
    if (window.paypal && typeof window.paypal.HostedButtons === 'function') {
       // @ts-ignore
      window.paypal.HostedButtons({ hosted_button_id: hostedButtonId }).render(`#paypal-container-${hostedButtonId}`);
    }
  }, [hostedButtonId]);

  return (
    <div className="w-full max-w-sm p-6 rounded-lg">
      <Script 
          src={`https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&components=hosted-buttons&disable-funding=venmo&currency=USD`}
          strategy="afterInteractive"
          onLoad={() => {
              // @ts-ignore
              if (window.paypal) {
                  // @ts-ignore
                  window.paypal.HostedButtons({ hosted_button_id: hostedButtonId }).render(`#paypal-container-${hostedButtonId}`);
              }
          }}
      />
      <h2 className="text-5xl font-bold text-center mb-4 text-primary">{price}</h2>
      <div id={`paypal-container-${hostedButtonId}`} className="w-full flex justify-center"></div>
      <div className="mt-4 w-full p-2 bg-muted border border-border rounded-md text-center">
          <label htmlFor={`machineId-${hostedButtonId}`} className="text-sm mb-2 text-black dark:text-yellow-300 block">Enter Your Machine ID</label>
          <Input
            id={`machineId-${hostedButtonId}`}
            type="text"
            placeholder="Your unique machine ID..."
            className="text-center bg-background"
          />
          <div className="text-xs text-muted-foreground mt-1">
              Find this in the plugin's "REGISTER" window.
          </div>
      </div>
      <div className="mt-2 w-full p-2 bg-muted border border-border rounded-md text-center">
          <div className="text-sm mb-2 text-black dark:text-yellow-300">Serial Number</div>
          <div className="font-bold text-green-600 text-lg min-h-[28px] flex items-center justify-center">
              <span className="text-muted-foreground/80 italic text-sm">Your serial will be sent to your email</span>
          </div>
      </div>
    </div>
  );
}
