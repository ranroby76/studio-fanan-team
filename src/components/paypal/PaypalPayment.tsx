// src/components/paypal/PaypalPayment.tsx
"use client";

import { useState } from 'react';
import {
  PayPalScriptProvider,
  PayPalButtons,
  type OnApproveData,
  type OnApproveActions,
  type CreateOrderData,
  type CreateOrderActions
} from "@paypal/react-paypal-js";
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ShieldCheck, Edit, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "sb";

interface PaypalPaymentProps {
  price: string;
  title: string;
}

export default function PaypalPayment({ price, title }: PaypalPaymentProps) {
  const { toast } = useToast();
  const [machineId, setMachineId] = useState('');
  const [isIdConfirmed, setIsIdConfirmed] = useState(false);
  const [showPaypalButtons, setShowPaypalButtons] = useState(false);
  const [serialNumber, setSerialNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleIdConfirm = () => {
    if (machineId.trim().length > 5) {
      setIsIdConfirmed(true);
      setShowPaypalButtons(true);
      setError(null);
    } else {
      toast({
        title: "Invalid ID",
        description: "Please enter a valid Machine ID (more than 5 characters).",
        variant: "destructive",
      });
    }
  };
  
  const createOrder = (data: CreateOrderData, actions: CreateOrderActions) => {
    return actions.order.create({
      purchase_units: [
        {
          description: `Fanan Team Product: ${title}`,
          amount: {
            value: price,
            currency_code: 'USD',
          },
          custom_id: machineId, // Pass machine ID here
        },
      ],
      application_context: {
        shipping_preference: 'NO_SHIPPING',
      }
    });
  };

  const onApprove = async (data: OnApproveData, actions: OnApproveActions) => {
    setIsLoading(true);
    setError(null);
    try {
        if (!actions.order) {
            throw new Error("Order actions are not available.");
        }
      const details = await actions.order.capture();
      
      // Simulate calling a serverless function to generate a serial
      // In a real app, you would make a fetch request to your backend API
      // e.g., const response = await fetch('/api/generate-serial', { ... });
      // const { serial } = await response.json();

      // For demonstration, we'll just create a "serial" from the order ID and machine ID.
      const generatedSerial = `FN-${details.id.substring(0, 8)}-${machineId.substring(0, 4)}`.toUpperCase();
      
      setSerialNumber(generatedSerial);
      setShowPaypalButtons(false);
      
      toast({
        title: "Payment Successful!",
        description: "Your serial number has been generated.",
        variant: "default",
      });

    } catch (err: any) {
      console.error("Payment approval error:", err);
      setError("Payment could not be processed. Please try again or contact support.");
      toast({
        title: "Payment Failed",
        description: "An error occurred during payment approval.",
        variant: "destructive",
      });
    } finally {
        setIsLoading(false);
    }
  };

  const onError = (err: any) => {
    console.error("PayPal Error:", err);
    setError("An error occurred with the PayPal transaction. Please refresh and try again.");
    toast({
      title: 'PayPal Error',
      description: 'Something went wrong with the transaction.',
      variant: 'destructive',
    });
    setShowPaypalButtons(false);
    setIsIdConfirmed(false);
  };


  if (PAYPAL_CLIENT_ID === "sb") {
    return (
       <div className="w-full max-w-sm p-6 rounded-lg">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Configuration Error</AlertTitle>
            <AlertDescription>
              The PayPal Client ID is not configured. Payment system is disabled.
            </AlertDescription>
          </Alert>
       </div>
    )
  }

  return (
    <PayPalScriptProvider options={{ clientId: PAYPAL_CLIENT_ID, currency: "USD", "disable-funding": "credit,card" }}>
      <div className="w-full max-w-sm p-6 rounded-lg">
        <h2 className="text-5xl font-bold text-center mb-4 text-primary">{title}</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor={`custom_unique_id-${price}`} className="block text-sm font-medium text-foreground mb-2">Your Unique Machine ID</label>
            <div className="flex items-center gap-2">
                <Input 
                  type="text" 
                  id={`custom_unique_id-${price}`}
                  placeholder="Enter your ID here" 
                  value={machineId}
                  onChange={(e) => setMachineId(e.target.value)}
                  disabled={isIdConfirmed || isLoading}
                  required
                  className="w-full px-3 py-2"
                />
                 {isIdConfirmed && (
                  <Button variant="outline" size="icon" onClick={() => { setIsIdConfirmed(false); setShowPaypalButtons(false); }} aria-label="Edit Machine ID">
                    <Edit className="h-4 w-4" />
                  </Button>
                )}
            </div>
          </div>

          {!isIdConfirmed && (
            <Button onClick={handleIdConfirm} className="w-full" disabled={!machineId}>
              <ShieldCheck className="mr-2 h-4 w-4" />
              Confirm ID
            </Button>
          )}
          
          <div className="w-full p-2 bg-muted border border-border rounded-md text-center">
            <div className="text-sm mb-2 text-black dark:text-yellow-300">Serial Number</div>
            <div className="font-bold text-green-600 text-lg min-h-[28px] flex items-center justify-center">
              {serialNumber || <span className="text-muted-foreground/80 italic text-sm">The serial will appear here after purchase</span>}
            </div>
          </div>
          
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {isLoading && (
              <div className="flex justify-center items-center">
                <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                <span>Processing...</span>
              </div>
            )
          }

          {showPaypalButtons && !isLoading && !serialNumber && (
            <div className="pt-2 min-h-[50px]">
              <PayPalButtons
                style={{ layout: 'vertical', color: 'gold', shape: 'rect', label: 'pay' }}
                createOrder={createOrder}
                onApprove={onApprove}
                onError={onError}
                forceReRender={[machineId, price]}
              />
            </div>
          )}
        </div>
      </div>
    </PayPalScriptProvider>
  );
}
