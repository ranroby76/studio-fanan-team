// src/app/buy-now/page.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart, ShieldCheck, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function BuyNowPage() {
  return (
    <div className="container mx-auto px-4">
      <div className="animate-fade-in space-y-12">
        <Card className="shadow-xl text-center">
          <CardHeader>
            <ShoppingCart className="mx-auto h-12 w-12 text-primary mb-4" />
            <CardTitle className="text-4xl font-headline text-primary">Ready to Purchase?</CardTitle>
            <CardDescription className="text-lg text-foreground/80 max-w-2xl mx-auto">
              Finalize your selection and proceed to our secure checkout.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-foreground/80">
              Currently, our direct "Buy Now" page is under construction as we integrate a new payment gateway.
              For now, please browse our products and follow the purchase instructions on each product page or contact us for direct sales.
            </p>
            <Image 
              src="https://placehold.co/800x300.png" 
              alt="Payment methods"
              width={800}
              height={300}
              className="rounded-lg shadow-md object-cover mx-auto"
              data-ai-hint="credit cards"
            />
            <div className="flex items-center justify-center gap-2 text-green-600">
              <ShieldCheck className="h-6 w-6" />
              <span className="font-semibold">Your transactions are always secure.</span>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Button size="lg" asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Link href="/products">
                  Browse Products <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="border-accent text-accent hover:bg-accent/10">
                <Link href="/contact-us">
                  Contact Sales
                </Link>
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-6">
              We appreciate your patience and look forward to providing you with our exceptional VST plugins!
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
