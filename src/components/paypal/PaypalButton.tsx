// src/components/paypal/PaypalButton.tsx
"use client";

import { useState, useEffect } from 'react';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from 'lucide-react';
import emailjs from '@emailjs/browser';

interface PaypalButtonProps {
  price: string;
  hostedButtonId: string;
}

const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "";
const EMAILJS_PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || "";
const EMAILJS_SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || "";
const EMAILJS_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || "";


export default function PaypalButton({ price, hostedButtonId }: PaypalButtonProps) {
  const [machineId, setMachineId] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    if (EMAILJS_PUBLIC_KEY) {
      emailjs.init(EMAILJS_PUBLIC_KEY);
    }
  }, []);

  const isButtonDisabled = machineId.length < 4 || isProcessing || serialNumber !== '';
  
  const createOrder = (data: any, actions: any) => {
    if (!machineId) {
        toast({
            title: "Machine ID is missing",
            description: "Please enter your Machine ID before proceeding.",
            variant: "destructive"
        });
        return actions.reject();
    }
    return actions.order.create({
        purchase_units: [{
            amount: {
                value: price
            },
            custom_id: machineId
        }],
        application_context: {
            shipping_preference: 'NO_SHIPPING'
        }
    });
  };

  const onApprove = (data: any, actions: any) => {
    setIsProcessing(true);
    return actions.order.capture().then(function(details: any) {
        const customId = details.purchase_units[0].custom_id;
        const generatedSerial = Math.floor(((((((parseInt(customId) + 8354) * 2) + 1691) * 2) - 9097) * 0.1));
        const finalSerialNumber = String(generatedSerial);

        setSerialNumber(finalSerialNumber);
        
        toast({
            title: 'Payment Successful!',
            description: 'Your serial number has been generated and sent to your email.',
        });

        const customerEmail = details.payer.email_address;
        const customerName = details.payer.name.given_name;
        const countryCode = details.payer.address.country_code;

        const templateParams = {
            to_email: customerEmail,
            to_name: customerName,
            serial_number: finalSerialNumber,
            amount: details.purchase_units[0].amount.value,
            item_name: `Fanan Team Product (Price: $${price})`,
            country_code: countryCode,
        };
        
        if (EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID) {
          emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
              .then(
                  function(response) {
                      console.log("Email SUCCESS:", response);
                  },
                  function(error) {
                      console.log("Email FAILED:", error);
                       toast({
                          title: 'Email Failed',
                          description: 'Could not send serial number email. Please contact support.',
                          variant: 'destructive',
                      });
                  }
              );
        } else {
             console.error("EmailJS credentials not configured.");
             toast({
                title: 'Email Not Sent',
                description: 'EmailJS is not configured. Please contact support for your serial number.',
                variant: 'destructive',
            });
        }
        setIsProcessing(false);
    }).catch((err: any) => {
        toast({
            title: 'Payment Capture Failed',
            description: 'There was an issue finalizing your payment. Please try again or contact support.',
            variant: 'destructive',
        });
        setIsProcessing(false);
    });
  };

  const onError = (err: any) => {
     toast({
        title: 'PayPal Error',
        description: 'An error occurred with the PayPal transaction. Please try again.',
        variant: 'destructive',
      });
      setIsProcessing(false);
  }

  if (!PAYPAL_CLIENT_ID) {
    return <div className="text-destructive text-center">PayPal Client ID is not configured.</div>
  }

  return (
    <PayPalScriptProvider options={{ "client-id": PAYPAL_CLIENT_ID, currency: "USD" }}>
      <div className="w-full max-w-sm flex flex-col items-center gap-4">
        <div className="text-5xl font-bold text-center mb-4 text-primary">${price}</div>
        
        <div className="mt-4 w-full max-w-sm p-2 bg-muted border border-border rounded-md text-center">
            <label 
              htmlFor={`machineId-${hostedButtonId}`}
              className={`mb-2 block transition-all duration-300 ${isButtonDisabled && !serialNumber ? 'blinking-text font-bold text-lg text-red-500 dark:text-red-400' : 'text-sm text-black dark:text-yellow-300'}`}
            >
              ENTER YOUR ID HERE FIRST!
            </label>
            <Input 
              id={`machineId-${hostedButtonId}`}
              type="text" 
              placeholder="Your unique machine ID..." 
              className="text-center bg-background"
              value={machineId}
              onChange={(e) => setMachineId(e.target.value)}
              disabled={isProcessing || serialNumber !== ''}
            />
            <div 
              className="text-xs text-white mt-2 font-semibold"
              style={{ textShadow: '0 0 8px rgba(255, 255, 255, 0.8)' }}
            >
                Find this in the plugin's "REGISTER" window.
            </div>
        </div>

        <div className="relative w-full min-h-[50px]">
          {isProcessing && (
            <div className="absolute inset-0 flex items-center justify-center z-10 bg-background/50 backdrop-blur-sm rounded-md">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Processing...</span>
            </div>
          )}
          {!serialNumber && (
            <PayPalButtons
              key={machineId}
              style={{ layout: "vertical", color: "gold", shape: "rect", label: "buynow" }}
              disabled={isButtonDisabled}
              createOrder={createOrder}
              onApprove={onApprove}
              onError={onError}
              forceReRender={[machineId, price]}
            />
          )}
        </div>
        
        <div className="mt-2 w-full max-w-sm p-2 bg-muted border border-border rounded-md text-center">
            <div className="text-sm mb-2 text-black dark:text-yellow-300">Serial Number</div>
            <div className="font-bold text-green-600 dark:text-green-400 text-lg min-h-[28px] flex items-center justify-center break-all px-2">
                {serialNumber ? (
                  <span>{serialNumber}</span>
                ) : (
                  <span className="text-muted-foreground/80 italic text-sm">Your serial will be sent to your email and shown here</span>
                )}
            </div>
        </div>

      </div>
    </PayPalScriptProvider>
  );
}
