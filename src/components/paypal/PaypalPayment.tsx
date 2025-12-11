// src/components/paypal/PaypalPayment.tsx
"use client";

import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Loader2, ShieldCheck, Edit, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface PaypalPaymentProps {
  price: string;
  title: string;
}

// NOTE: The PayPal SDK integration has been temporarily removed to resolve a critical
// build issue. The component is now a placeholder.

export default function PaypalPayment({ price, title }: PaypalPaymentProps) {

  return (
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
                  required
                  className="w-full px-3 py-2"
                />
            </div>
          </div>

          <Button className="w-full" disabled>
              <ShieldCheck className="mr-2 h-4 w-4" />
              Confirm ID
          </Button>
          
          <div className="w-full p-2 bg-muted border border-border rounded-md text-center">
            <div className="text-sm mb-2 text-black dark:text-yellow-300">Serial Number</div>
            <div className="font-bold text-green-600 text-lg min-h-[28px] flex items-center justify-center">
                <span className="text-muted-foreground/80 italic text-sm">The serial will appear here after purchase</span>
            </div>
          </div>
          
           <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Payment Unavailable</AlertTitle>
              <AlertDescription>
                The payment system is temporarily unavailable. Please check back later.
              </AlertDescription>
            </Alert>
        </div>
      </div>
  );
}
