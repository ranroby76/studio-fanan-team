// src/app/how-to-buy/page.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { HelpCircle, ShieldCheck, DownloadCloud, ShoppingCart, UserCheck, FileWarning, Contact } from "lucide-react";
import Link from "next/link";

export default function HowToBuyPage() {
  return (
    <div className="container mx-auto px-4">
      <div className="animate-fade-in space-y-12">
        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <HelpCircle className="mx-auto h-12 w-12 text-primary mb-4" />
            <CardTitle className="text-4xl font-headline text-primary">Registration & Purchasing Guide</CardTitle>
            <CardDescription className="text-lg text-foreground/80 max-w-3xl mx-auto">
              Welcome! Here are some instructions that will help you use our new automatic system.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8 mt-4">

            <Card className="bg-secondary/30 shadow-md">
              <CardHeader className="flex flex-row items-center gap-4">
                <DownloadCloud className="h-10 w-10 text-secondary-foreground flex-shrink-0" />
                <div>
                  <CardTitle className="font-headline text-2xl text-secondary-foreground">1. Try the Demo First!</CardTitle>
                  <CardDescription className="text-secondary-foreground/80">Avoid the headache of regret.</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-foreground/80 leading-relaxed">
                  Don't buy anything before downloading and trying the demo or free edition first. Make sure you are pleased with the results. Our policy generally declines refunds after a serial has been provided, and that's why our demos are maximum-functional or include free editions.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card/50 shadow-md">
              <CardHeader className="flex flex-row items-center gap-4">
                <UserCheck className="h-10 w-10 text-accent" />
                <div>
                  <CardTitle className="font-headline text-2xl text-primary">2. Select the Correct Bundle</CardTitle>
                  <CardDescription>Ensure your desired plugin is in the chosen pack.</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-foreground/80 leading-relaxed mb-3">
                  We've decreased the plugin bundles to 3. All the veteran plugins are now part of the same bundle called **"MAX!"**.
                </p>
                <p className="text-foreground/80 leading-relaxed">
                  If you're an existing customer and you've already bought at least one bundle from us before (at any price), you can use your old serial number, and it will unlock the "MAX!" bundle completely.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card/50 shadow-md">
              <CardHeader className="flex flex-row items-center gap-4">
                <ShoppingCart className="h-10 w-10 text-accent" />
                <div>
                  <CardTitle className="font-headline text-2xl text-primary">3. The Purchasing Process</CardTitle>
                  <CardDescription>From your DAW to your email.</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-foreground/80 leading-relaxed">If you've decided which bundle you want to buy:</p>
                <ol className="list-decimal list-inside space-y-3 pl-4 text-foreground/80">
                  <li>Download any plugin from your desired bundle and open it in your favorite DAW.</li>
                  <li>Press the **“REGISTER”** button on the plugin interface to get your unique **Machine ID** number.</li>
                  <li>Go to the <Link href="/buy-now" className="font-semibold text-accent hover:underline">"Buy Now"</Link> page on our site.</li>
                  <li>Enter your Machine ID into the text box that matches your chosen bundle (e.g., for "Callisto VSTi", use the "MAX!" bundle's ID box).</li>
                  <li>Press **"BUY NOW"** and complete the purchase.</li>
                  <li>Once complete, you'll receive your purchase details and a matching **serial number** in your email.</li>
                  <li>Copy the serial number, go back to the opened plugin in your DAW, paste it, and press **"Save"**.</li>
                </ol>
                <p className="font-semibold text-primary">Once at least one plugin is registered, the entire bundle becomes registered as well.</p>
              </CardContent>
            </Card>

            <Card className="bg-card/50 shadow-md">
              <CardHeader className="flex flex-row items-center gap-4">
                <FileWarning className="h-10 w-10 text-amber-600" />
                <div>
                  <CardTitle className="font-headline text-2xl text-amber-700">Important: License File Location</CardTitle>
                  <CardDescription>Do not move the license file!</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-foreground/80 leading-relaxed">
                  Normally, pressing ”save” will save the license file to the <code className="bg-muted px-1.5 py-0.5 rounded-md font-mono text-sm">C:\Fananteam</code> folder. Do not change the folder's location or transport the file elsewhere, or the registration will not work!
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card/50 shadow-md">
              <CardHeader className="flex flex-row items-center gap-4">
                <ShieldCheck className="h-10 w-10 text-green-600" />
                <div>
                  <CardTitle className="font-headline text-2xl text-green-700">Your Privacy is Our Priority</CardTitle>
                  <CardDescription>We respect the modesty of the individual.</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-foreground/80 leading-relaxed">
                  Fanan team will always ensure your privacy as a user. Our plugins never use your internet connection, nor do they use any registry files, tricks, or digital spies. Our new registration system focuses on ease of use and comfort, but above all, on privacy.
                </p>
              </CardContent>
            </Card>

          </CardContent>
        </Card>

        <Card className="bg-secondary/30 shadow-lg text-center">
          <CardHeader>
            <Contact className="mx-auto h-8 w-8 text-secondary-foreground mb-2" />
            <CardTitle className="font-headline text-2xl text-secondary-foreground">Have Fun & Get In Touch</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-foreground/80 mb-4">
              Contact us for any additional information. We hope you enjoy our plugins!
            </p>
            <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <Link href="/contact-us">
                Contact Support
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
