// src/components/paypal/PaypalButton.tsx
"use client";

import { useState } from 'react';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from 'lucide-react';

interface PaypalButtonProps {
  hostedButtonId: string;
  price: string;
}

const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "";

export default function PaypalButton({ hostedButtonId, price }: PaypalButtonProps) {
  const [machineId, setMachineId] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const isButtonDisabled = machineId.length < 4 || isLoading || serialNumber !== '';

  const createOrder = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/paypal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          price: price, // Pass the price directly
        }),
      });
      const order = await response.json();
      if (order.id) {
        return order.id;
      } else {
        throw new Error(order.error || 'Failed to create order.');
      }
    } catch (err: any) {
      toast({
        title: 'Order Creation Failed',
        description: err.message,
        variant: 'destructive',
      });
      setIsLoading(false);
      return null;
    }
  };

  const onApprove = async (data: any) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/paypal', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderID: data.orderID,
          machineId: machineId, // Pass the machine ID to the backend
        }),
      });
      const details = await response.json();
      if (details.error) {
        throw new Error(details.error);
      }
      
      // The backend returns the generated serial number upon successful capture
      setSerialNumber(details.serialNumber);
      
      toast({
        title: 'Payment Successful!',
        description: 'Your serial number has been generated.',
      });
    } catch (err: any) {
      toast({
        title: 'Payment Capture Failed',
        description: err.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onError = (err: any) => {
     toast({
        title: 'PayPal Error',
        description: 'An error occurred with the PayPal transaction. Please try again.',
        variant: 'destructive',
      });
      setIsLoading(false);
  }

  if (!PAYPAL_CLIENT_ID) {
    return <div className="text-destructive text-center">PayPal Client ID is not configured.</div>
  }

  return (
    <PayPalScriptProvider options={{ "client-id": PAYPAL_CLIENT_ID, currency: "USD", components: "buttons" }}>
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
              disabled={isLoading || serialNumber !== ''}
            />
            <div 
              className="text-xs text-white mt-2 font-semibold"
              style={{ textShadow: '0 0 8px rgba(255, 255, 255, 0.8)' }}
            >
                Find this in the plugin's "REGISTER" window.
            </div>
        </div>

        <div className="relative w-full min-h-[50px]">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center z-10 bg-background/50 backdrop-blur-sm rounded-md">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Processing...</span>
            </div>
          )}
          {!serialNumber && (
            <PayPalButtons
              style={{ layout: "vertical", color: "gold", shape: "rect", label: "buynow" }}
              disabled={isButtonDisabled}
              createOrder={createOrder}
              onApprove={onApprove}
              onError={onError}
              forceReRender={[machineId, isButtonDisabled]}
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
