// src/components/paypal/PaypalPayment.tsx
"use client";

import { useState, useEffect, useRef } from 'react';
import Script from 'next/script';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Loader2, ShieldCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
  const [isIdConfirmed, setIsIdConfirmed] = useState(false);
  const [idError, setIdError] = useState<string | null>(null);
  const [serialNumber, setSerialNumber] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const paypalContainerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const paypalButtonContainerId = `paypal-button-container-${price.replace('.', '')}`;

  useEffect(() => {
    if (window.emailjs) {
      window.emailjs.init("nIdzP2wHIUKIQ5XFZ");
    }
  }, []);

  useEffect(() => {
    if (scriptLoaded && isIdConfirmed && window.paypal && paypalContainerRef.current) {
      const paypalContainer = paypalContainerRef.current;
      if (paypalContainer && paypalContainer.children.length === 0) {
        setIsLoading(false);
        try {
          window.paypal.Buttons({
            createOrder: function(data: any, actions: any) {
              return actions.order.create({
                purchase_units: [{
                  amount: {
                    value: price
                  },
                  custom_id: customId
                }]
              });
            },
            onApprove: function(data: any, actions: any) {
              return actions.order.capture().then(function(details: any) {
                const capturedCustomId = details.purchase_units[0].custom_id;
                
                let newSerialNumber;
                if (price === "12.00") {
                   newSerialNumber = (((((parseInt(capturedCustomId) + 7541) * 2) + 2001) * 2) - 9002);
                } else {
                  newSerialNumber = Math.floor(((((((parseInt(capturedCustomId) + 8354) * 2) + 1691) * 2) - 9097) * 0.1));
                }

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

                toast({
                    title: 'Transaction Completed!',
                    description: 'Check your email for the serial number.',
                });
              });
            },
            onError: function(err: any) {
                console.error('PayPal Button Error:', err);
                toast({
                    title: 'Payment Error',
                    description: 'An error occurred with the payment process. Please try again.',
                    variant: 'destructive',
                });
            }
          }).render(`#${paypalButtonContainerId}`);
        } catch (err) {
            console.error('Failed to render PayPal buttons:', err);
        }
      }
    }
  }, [scriptLoaded, price, paypalButtonContainerId, customId, isIdConfirmed, toast]);

  const handleIdConfirmation = () => {
    const isValidId = /^\d{4,}$/.test(customId);
    if (isValidId) {
      setIdError(null);
      setIsIdConfirmed(true);
    } else {
      setIdError("ID must be at least 4 digits and contain only numbers.");
      setIsIdConfirmed(false);
    }
  };

  return (
    <>
      <Script 
        src="https://www.paypal.com/sdk/js?client-id=AUEpCQ6b-llAtrDDOTPf9TUXoVilqCFYksW0bU05Au-aJ6jhprFO5I1INDGyTmHxzJ1EriiAHe-e6O4T&currency=USD"
        onLoad={() => {
            setScriptLoaded(true);
            setIsLoading(false);
        }}
        onError={(e) => {
            console.error("PayPal SDK failed to load", e);
            setIsLoading(false);
        }}
      />
      <Script 
        src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"
        onLoad={() => {
            if (typeof window.emailjs !== 'undefined') {
                window.emailjs.init("nIdzP2wHIUKIQ5XFZ");
            }
        }}
        onError={(e) => {
            console.error("EmailJS SDK failed to load", e);
        }}
      />
      <div className="w-full max-w-sm p-6 rounded-lg">
        <h2 className="text-5xl font-bold text-center mb-4 text-primary">{title}</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor={`custom_unique_id-${price}`} className="block text-sm font-medium text-foreground mb-2">Your Unique Machine ID</label>
            <Input 
              type="text" 
              id={`custom_unique_id-${price}`}
              placeholder="Enter your ID here" 
              value={customId}
              onChange={(e) => {
                setCustomId(e.target.value);
                if (isIdConfirmed) setIsIdConfirmed(false); // Force re-confirmation on change
              }}
              required
              disabled={isIdConfirmed}
              className="w-full px-3 py-2"
            />
            {idError && <p className="text-sm text-destructive mt-1">{idError}</p>}
          </div>

          {!isIdConfirmed && (
            <Button onClick={handleIdConfirmation} className="w-full">
                <ShieldCheck className="mr-2 h-4 w-4" />
                Confirm ID
            </Button>
          )}
          
          <div className="w-full p-2 bg-muted border border-border rounded-md text-center">
            <div className="text-sm mb-2 text-black dark:text-yellow-300">Serial Number</div>
            <div className="font-bold text-green-600 text-lg min-h-[28px] flex items-center justify-center">
              {serialNumber ? (
                serialNumber
              ) : (
                <span className="text-muted-foreground/80 italic text-sm">The serial will appear here after purchase</span>
              )}
            </div>
          </div>
          
          {isIdConfirmed && (
            <>
              {isLoading && 
                <div className="flex items-center justify-center text-muted-foreground">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading payment options...
                </div>
              }
              <div id={paypalButtonContainerId} ref={paypalContainerRef} className="w-full min-h-[100px]"></div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
