// src/app/vip-login/page.tsx
"use client";

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { sendSignInLinkToEmail } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { KeyRound, Loader2, MailCheck } from 'lucide-react';

const vipEmails = ["ranroby76@gmail.com", "ronbm19@gmail.com"];

const vipLoginSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
});

type VipLoginForm = z.infer<typeof vipLoginSchema>;

export default function VipLoginPage() {
  const { toast } = useToast();
  const [isLinkSent, setIsLinkSent] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<VipLoginForm>({
    resolver: zodResolver(vipLoginSchema),
  });

  const onSubmit: SubmitHandler<VipLoginForm> = async ({ email }) => {
    if (!vipEmails.includes(email.toLowerCase())) {
      toast({
        title: 'Access Denied',
        description: 'The email provided is not a registered VIP email.',
        variant: 'destructive',
      });
      return;
    }

    const actionCodeSettings = {
      // URL to redirect back to. The domain (www.example.com) must be authorized
      // in the Firebase Console.
      url: `${window.location.origin}/`, // Redirect to home page after sign-in
      handleCodeInApp: true,
    };

    try {
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      // Save the email locally so you don't need to ask for it again
      // on the same device.
      window.localStorage.setItem('emailForSignIn', email);
      setIsLinkSent(true);
      toast({
        title: 'Check Your Email',
        description: `A sign-in link has been sent to ${email}.`,
      });
    } catch (error: any) {
      console.error("Error sending sign-in link:", error);
      toast({
        title: 'Error',
        description: 'Could not send sign-in link. Please try again later.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="container mx-auto px-4 flex justify-center items-center py-12">
      <Card className="w-full max-w-md shadow-xl animate-fade-in">
        <CardHeader className="text-center">
          <KeyRound className="mx-auto h-12 w-12 text-primary mb-4" />
          <CardTitle className="text-4xl font-headline text-primary">VIP Admin Login</CardTitle>
          <CardDescription className="text-lg text-foreground/80">
            Enter your registered admin email to receive a secure sign-in link.
          </CardDescription>
        </CardHeader>
        {isLinkSent ? (
          <CardContent className="text-center">
            <MailCheck className="mx-auto h-16 w-16 text-green-500 mb-4" />
            <h3 className="text-2xl font-semibold text-primary">Link Sent!</h3>
            <p className="text-foreground/90 mt-2">
              A verification link has been sent to your email address. Please check your inbox and click the link to complete the sign-in process.
            </p>
          </CardContent>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="email" className="font-semibold sr-only">Your VIP Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your VIP email"
                  {...register('email')}
                  className="py-6 text-center"
                />
                {errors.email && <p className="text-sm text-destructive mt-2 text-center">{errors.email.message}</p>}
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full text-lg py-6" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Sending Link...
                  </>
                ) : (
                  'Send Verification Link'
                )}
              </Button>
            </CardFooter>
          </form>
        )}
      </Card>
    </div>
  );
}
