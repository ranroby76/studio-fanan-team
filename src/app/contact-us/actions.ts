'use server';

import { z } from 'zod';

const contactFormSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  subject: z.string(),
  message: z.string(),
});

type ContactFormState = {
  success: boolean;
  error?: string | null;
}

export async function sendContactMessage(formData: z.infer<typeof contactFormSchema>): Promise<ContactFormState> {
  const validatedFields = contactFormSchema.safeParse(formData);

  if (!validatedFields.success) {
    return { 
      success: false, 
      error: 'Invalid form data.' 
    };
  }
  
  const { name, email, subject, message } = validatedFields.data;

  try {
    // Here is where you would integrate an email sending service like Resend, Nodemailer, etc.
    // For now, we will just log the data to the console to simulate a successful submission.
    console.log('New Contact Message Received:');
    console.log(`- Name: ${name}`);
    console.log(`- Email: ${email}`);
    console.log(`- Subject: ${subject}`);
    console.log(`- Message: ${message}`);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    return { success: true };

  } catch (error) {
    console.error('Error sending contact message:', error);
    return { 
      success: false, 
      error: 'Failed to send message.'
    };
  }
}
