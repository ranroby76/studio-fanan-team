// src/components/paypal/PaypalPayment.tsx
"use client";

import { useState, useEffect, useRef } from 'react';
import Script from 'next/script';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Loader2 } from 'lucide-react';

declare global {
  interface Window {
    paypal: any;
    emailjs: any;
  }
}

interface PaypalPaymentProps {
  price: string;
  title: string;
}

export default function PaypalPayment({ price, title }: PaypalPaymentProps) {
  const [customId, setCustomId] = useState('');
  const [serialNumber, setSerialNumber] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const paypalContainerRef = useRef<HTMLDivElement>(null);
  const customIdRef = useRef<HTMLInputElement>(null);

  // Use a unique ID for each PayPal button container to avoid conflicts
  const paypalButtonContainerId = `paypal-button-container-${price.replace('.', '')}`;

  useEffect(() => {
    if (window.emailjs) {
      window.emailjs.init("nIdzP2wHIUKIQ5XFZ");
    }
  }, []);

  useEffect(() => {
    if (scriptLoaded && window.paypal) {
      const paypalContainer = document.getElementById(paypalButtonContainerId);
      if (paypalContainer && paypalContainer.children.length === 0) {
        setIsLoading(false);
        try {
          window.paypal.Buttons({
            createOrder: function(data: any, actions: any) {
              const currentCustomId = customIdRef.current?.value;
              if (!currentCustomId) {
                alert('Please enter your ID before proceeding to payment.');
                return false;
              }
              return actions.order.create({
                purchase_units: [{
                  amount: {
                    value: price
                  },
                  custom_id: currentCustomId
                }]
              });
            },
            onApprove: function(data: any, actions: any) {
              return actions.order.capture().then(function(details: any) {
                const capturedCustomId = details.purchase_units[0].custom_id;
                const newSerialNumber = Math.floor(((((((parseInt(capturedCustomId) + 8354) * 2) + 1691) * 2) - 9097) * 0.1));
                setSerialNumber(newSerialNumber.toString());
                
                const customerEmail = details.payer.email_address;
                
                const templateParams = {
                  to_email: customerEmail,
                  to_name: details.payer.name.given_name,
                  serial_number: newSerialNumber,
                  amount: details.purchase_units[0].amount.value
                };
                
                window.emailjs.send("service_ygtr2vr", "template_mwkot2m", templateParams)
                  .then(
                    function(response: any) {
                      console.log("Email SUCCESS:", response);
                    },
                    function(error: any) {
                      console.log("Email FAILED:", error);
                    }
                  );

                alert('Transaction completed! Check your email for the serial number.');
              });
            },
            onError: function(err: any) {
                console.error('PayPal Button Error:', err);
                alert('An error occurred with the payment process. Please try again.');
            }
          }).render(`#${paypalButtonContainerId}`);
        } catch (err) {
            console.error('Failed to render PayPal buttons:', err);
        }
      }
    }
  }, [scriptLoaded, price, paypalButtonContainerId]);

  return (
    <>
      <Script 
        src="https://www.paypal.com/sdk/js?client-id=AUEpCQ6b-llAtrDDOTPf9TUXoVilqCFYksW0bU05Au-aJ6jhprFO5I1INDGyTmHxzJ1EriiAHe-e6O4T&currency=USD"
        onLoad={() => {
            console.log("PayPal SDK loaded.");
            setScriptLoaded(true);
        }}
        onError={(e) => {
            console.error("PayPal SDK failed to load", e);
            setIsLoading(false);
        }}
      />
      <Script 
        src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"
        onLoad={() => {
            console.log("EmailJS SDK loaded.");
            if (typeof window.emailjs !== 'undefined') {
                window.emailjs.init("nIdzP2wHIUKIQ5XFZ");
            }
        }}
        onError={(e) => {
            console.error("EmailJS SDK failed to load", e);
        }}
      />
      <div className="w-full max-w-sm mx-auto bg-card p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-4 text-primary">{title}</h2>
        <form id={`paypal-form-${price}`} onSubmit={(e) => e.preventDefault()}>
          <label htmlFor={`custom_unique_id-${price}`} className="block text-sm font-medium text-foreground mb-2">Your Unique Machine ID</label>
          <Input 
            ref={customIdRef}
            type="text" 
            id={`custom_unique_id-${price}`}
            placeholder="Enter your ID here" 
            defaultValue={customId}
            onChange={(e) => setCustomId(e.target.value)}
            required
            className="w-full px-3 py-2 mb-4"
          />
          <div className="w-full mb-4 p-2 bg-muted border border-border rounded-md text-center">
            <div className="bg-yellow-300 text-black inline-block px-3 py-1 text-sm rounded-sm mb-2">Serial Number</div>
            <div className="font-bold text-green-600 text-lg min-h-[28px] flex items-center justify-center">
              {serialNumber ? (
                serialNumber
              ) : (
                <span className="text-muted-foreground/80 italic text-sm">The serial will appear here after purchase</span>
              )}
            </div>
          </div>
          {isLoading && 
            <div className="flex items-center justify-center text-muted-foreground">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading payment options...
            </div>
          }
          <div id={paypalButtonContainerId} className="w-full min-h-[100px]"></div>
        </form>
      </div>
    </>
  );
}
