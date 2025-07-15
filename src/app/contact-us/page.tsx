// src/app/contact-us/page.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, MessageCircle } from "lucide-react";

export default function ContactUsPage() {
  return (
    <div className="container mx-auto px-4">
      <div className="animate-fade-in space-y-12">
        <Card className="shadow-xl max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <Mail className="mx-auto h-12 w-12 text-primary mb-4" />
            <CardTitle className="text-4xl font-headline text-primary">Get In Touch</CardTitle>
            <CardDescription className="text-lg text-foreground/80">
              We'd love to hear from you!
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="p-6 bg-secondary/30 rounded-lg">
              <MessageCircle className="mx-auto h-8 w-8 text-secondary-foreground mb-3" />
              <p className="text-lg text-foreground/90 leading-relaxed mb-2">
                Feel free to write to us about anything—whether you have feedback, questions, or just want to say hello.
              </p>
              <p className="text-lg text-foreground/90 leading-relaxed">
                You can reach us directly at:
              </p>
              <a 
                href="mailto:fananteam@gmail.com" 
                className="mt-2 inline-block text-xl font-semibold text-accent hover:underline bg-accent/10 px-4 py-2 rounded-md transition-colors"
              >
                fananteam@gmail.com
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
