// src/components/paypal/PaypalPayment.tsx
"use client";

import { useState, useEffect, useRef } from 'react';
import Script from 'next/script';
import { Button } from '../ui/button';

declare global {
  interface Window {
    paypal: any;
    emailjs: any;
  }
}

export default function PaypalPayment() {
  const [customId, setCustomId] = useState('');
  const [serialNumber, setSerialNumber] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const paypalContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.emailjs) {
      window.emailjs.init("nIdzP2wHIUKIQ5XFZ");
    }
  }, []);

  useEffect(() => {
    if (scriptLoaded && window.paypal && paypalContainerRef.current) {
      if (paypalContainerRef.current.children.length > 0) {
        // PayPal button is already rendered, no need to re-render
        return;
      }
      setIsLoading(false);
      window.paypal.Buttons({
        createOrder: function(data: any, actions: any) {
          if (!customId) {
            alert('Please enter your ID before proceeding to payment.');
            return actions.reject();
          }
          return actions.order.create({
            purchase_units: [{
              amount: {
                value: '22.00'
              },
              custom_id: customId
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
      }).render(paypalContainerRef.current).catch((err: any) => {
          console.error('Failed to render PayPal buttons:', err);
      });
    }
  }, [scriptLoaded, customId]); // Re-checking on customId change is still good for validation logic inside createOrder

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
            setIsLoading(false); // Stop loading on error
        }}
      />
      <Script 
        src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"
        onLoad={() => {
            console.log("EmailJS SDK loaded.");
            window.emailjs.init("nIdzP2wHIUKIQ5XFZ");
        }}
        onError={(e) => {
            console.error("EmailJS SDK failed to load", e);
        }}
      />
      <div className="w-full max-w-sm mx-auto bg-card p-6 rounded-lg shadow-md">
        <form id="paypal-form" onSubmit={(e) => e.preventDefault()}>
          <label htmlFor="custom_unique_id" className="block text-sm font-medium text-foreground mb-2">Your Unique Machine ID</label>
          <input 
            type="text" 
            id="custom_unique_id" 
            placeholder="Enter your ID here" 
            value={customId}
            onChange={(e) => setCustomId(e.target.value)}
            required
            className="w-full px-3 py-2 mb-4 border border-input rounded-md text-foreground bg-background focus:ring-primary focus:border-primary"
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
          {isLoading && <p className="text-center text-muted-foreground">Loading payment options...</p>}
          <div ref={paypalContainerRef} id="paypal-button-container" className="w-full"></div>
        </form>
      </div>
    </>
  );
}
