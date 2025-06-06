// src/ai/flows/product-page-assistant.ts
'use server';

/**
 * @fileOverview An AI-powered assistant that generates content for product pages based on keywords.
 *
 * - generateProductPageContent - A function that generates product page content.
 * - ProductPageContentInput - The input type for the generateProductPageContent function.
 * - ProductPageContentOutput - The return type for the generateProductPageContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProductPageContentInputSchema = z.object({
  keywords: z
    .string()
    .describe('Keywords describing the VST product, separated by commas.'),
});
export type ProductPageContentInput = z.infer<typeof ProductPageContentInputSchema>;

const ProductPageContentOutputSchema = z.object({
  productDescription: z
    .string()
    .describe('A detailed and engaging description of the VST product.'),
  demoLimitations: z
    .string()
    .describe('A clear and concise description of the demo limitations.'),
});
export type ProductPageContentOutput = z.infer<typeof ProductPageContentOutputSchema>;

export async function generateProductPageContent(
  input: ProductPageContentInput
): Promise<ProductPageContentOutput> {
  return productPageAssistantFlow(input);
}

const prompt = ai.definePrompt({
  name: 'productPageAssistantPrompt',
  input: {schema: ProductPageContentInputSchema},
  output: {schema: ProductPageContentOutputSchema},
  prompt: `You are an AI assistant designed to help product managers create content for VST product pages.

  Based on the following keywords, generate a product description and demo limitations.

  Keywords: {{{keywords}}}

  Product Description:
  Demo Limitations: `,
});

const productPageAssistantFlow = ai.defineFlow(
  {
    name: 'productPageAssistantFlow',
    inputSchema: ProductPageContentInputSchema,
    outputSchema: ProductPageContentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
