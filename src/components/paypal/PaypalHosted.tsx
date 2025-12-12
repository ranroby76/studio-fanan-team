// src/components/paypal/PaypalHosted.tsx
"use client";

import { useEffect, useRef, useState } from 'react';
import Script from 'next/script';
import { Input } from "@/components/ui/input";

interface PaypalHostedProps {
  hostedButtonId: string;
  price: string;
}

const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "";

export default function PaypalHosted({ hostedButtonId, price }: PaypalHostedProps) {
  const [isSdkReady, setIsSdkReady] = useState(false);
  const renderAttempted = useRef(false);

  // 1. Reset logic when the Button ID changes (User navigates to new product)
  useEffect(() => {
    renderAttempted.current = false; // Allow rendering again
    const container = document.querySelector(`#paypal-container-${hostedButtonId}`);
    if (container) container.innerHTML = ""; // Clean up old button
    
    // If SDK is already there (from previous page visit), trigger render immediately
    // @ts-ignore
    if (window.paypal && window.paypal.HostedButtons) {
        setIsSdkReady(true);
    }
  }, [hostedButtonId]);

  // 2. The Render Logic
  useEffect(() => {
    if (isSdkReady && !renderAttempted.current) {
        const containerId = `#paypal-container-${hostedButtonId}`;
        const container = document.querySelector(containerId);

        if (container && container.childElementCount === 0) {
            try {
                // @ts-ignore
                window.paypal.HostedButtons({
                    hosted_button_id: hostedButtonId
                }).render(containerId);
                renderAttempted.current = true; // Mark as done for this ID
            } catch (err) {
                console.error("PayPal Render Error:", err);
            }
        }
    }
  }, [isSdkReady, hostedButtonId]);

  return (
    <div className="w-full max-w-sm p-6 rounded-lg">
      <Script 
          src={`https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&components=hosted-buttons&disable-funding=venmo&currency=USD`}
          strategy="afterInteractive" // Load sooner than lazyOnload
          onLoad={() => setIsSdkReady(true)}
      />
      
      <h2 className="text-5xl font-bold text-center mb-4 text-primary">{price}</h2>
      
      {/* Container with key ensures React re-creates div if ID changes */}
      <div 
        key={hostedButtonId} 
        id={`paypal-container-${hostedButtonId}`} 
        className="w-full flex justify-center min-h-[50px] z-0 relative"
      ></div>

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
