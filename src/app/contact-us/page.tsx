// src/app/contact-us/page.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Mail, Send, MapPin, Phone } from "lucide-react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export default function ContactUsPage() {
  const { toast } = useToast();
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
  });

  const onSubmit: SubmitHandler<ContactFormValues> = async (data) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log("Contact form submitted:", data);
    toast({
      title: "Message Sent!",
      description: "Thank you for contacting us. We'll get back to you soon.",
    });
    reset();
  };

  return (
    <div className="container mx-auto px-4">
      <div className="animate-fade-in space-y-12">
        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <Mail className="mx-auto h-12 w-12 text-primary mb-4" />
            <CardTitle className="text-4xl font-headline text-primary">Get In Touch</CardTitle>
            <CardDescription className="text-lg text-foreground/80">
              We'd love to hear from you! Send us a message with any questions or feedback.
            </CardDescription>
          </CardHeader>
          <CardContent className="max-w-2xl mx-auto">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <Label htmlFor="name" className="font-semibold">Full Name</Label>
                <Input id="name" placeholder="Your Name" {...register("name")} className="mt-1"/>
                {errors.name && <p className="text-sm text-destructive mt-1">{errors.name.message}</p>}
              </div>
              <div>
                <Label htmlFor="email" className="font-semibold">Email Address</Label>
                <Input id="email" type="email" placeholder="your@email.com" {...register("email")} className="mt-1"/>
                {errors.email && <p className="text-sm text-destructive mt-1">{errors.email.message}</p>}
              </div>
              <div>
                <Label htmlFor="subject" className="font-semibold">Subject</Label>
                <Input id="subject" placeholder="Regarding..." {...register("subject")} className="mt-1"/>
                {errors.subject && <p className="text-sm text-destructive mt-1">{errors.subject.message}</p>}
              </div>
              <div>
                <Label htmlFor="message" className="font-semibold">Message</Label>
                <Textarea id="message" placeholder="Your message here..." {...register("message")} rows={6} className="mt-1"/>
                {errors.message && <p className="text-sm text-destructive mt-1">{errors.message.message}</p>}
              </div>
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-3" disabled={isSubmitting}>
                {isSubmitting ? "Sending..." : <>Send Message <Send className="ml-2 h-5 w-5" /></>}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-8">
          <Card className="shadow-lg">
            <CardHeader>
              <MapPin className="h-8 w-8 text-accent mb-2" />
              <CardTitle className="font-headline text-2xl text-accent">Our Office</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground/80">123 Music Lane, Sound City, SC 54321</p>
              <p className="text-foreground/80">Planet Earth</p>
            </CardContent>
          </Card>
          <Card className="shadow-lg">
            <CardHeader>
              <Phone className="h-8 w-8 text-accent mb-2" />
              <CardTitle className="font-headline text-2xl text-accent">Call Us</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground/80">Support: +1 (234) 567-8900</p>
              <p className="text-foreground/80">Sales: +1 (234) 567-8901</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
