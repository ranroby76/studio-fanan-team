// src/app/how-to-buy/page.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { HelpCircle, ShoppingCart, CreditCard, DownloadCloud, CheckCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

const steps = [
  {
    icon: ShoppingCart,
    title: "1. Browse Our Products",
    description: "Explore our range of VST plugins on the products page. Read descriptions, check out demos, and find the perfect tools for your sound.",
    link: "/products",
    linkLabel: "Explore Products"
  },
  {
    icon: CreditCard,
    title: "2. Add to Cart & Checkout",
    description: "Once you've chosen your plugins, add them to your cart. Proceed to our secure checkout process. We accept various payment methods.",
    link: "/buy-now",
    linkLabel: "Go to Buy Now"
  },
  {
    icon: DownloadCloud,
    title: "3. Instant Download",
    description: "After successful payment, you'll receive an email with your license key(s) and download links for your purchased VST plugins.",
  },
  {
    icon: CheckCircle,
    title: "4. Install & Activate",
    description: "Follow the simple installation instructions for your DAW. Activate your plugin with the provided license key and start creating!",
  },
];

export default function HowToBuyPage() {
  return (
    <div className="animate-fade-in space-y-12">
      <Card className="shadow-xl">
        <CardHeader className="text-center">
          <HelpCircle className="mx-auto h-12 w-12 text-primary mb-4" />
          <CardTitle className="text-4xl font-headline text-primary">How to Buy Our VSTs</CardTitle>
          <CardDescription className="text-lg text-foreground/80 max-w-2xl mx-auto">
            A simple step-by-step guide to purchasing and downloading your Fanan Team plugins.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8 mt-4">
          {steps.map((step, index) => (
            <Card key={index} className="bg-card/50 shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6 flex flex-col sm:flex-row items-start gap-6">
                <div className="flex-shrink-0">
                  <step.icon className="h-10 w-10 text-accent bg-accent/10 p-2 rounded-full" />
                </div>
                <div className="flex-grow">
                  <h3 className="text-2xl font-headline font-semibold text-primary mb-2">{step.title}</h3>
                  <p className="text-foreground/80 leading-relaxed">{step.description}</p>
                  {step.link && step.linkLabel && (
                    <Button variant="link" asChild className="mt-3 p-0 text-accent hover:text-accent/80">
                      <Link href={step.link}>
                        {step.linkLabel} <ArrowRight className="ml-1 h-4 w-4" />
                      </Link>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>

      <Card className="bg-secondary/30 shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-2xl text-secondary-foreground">Need Assistance?</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-foreground/80 mb-4">
            If you encounter any issues during the purchase process or have any questions, please don't hesitate to reach out to our support team.
          </p>
          <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
            <Link href="/contact-us">
              Contact Support
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
