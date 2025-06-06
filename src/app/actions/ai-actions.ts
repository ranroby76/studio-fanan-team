// src/app/actions/ai-actions.ts
"use server";

import { generateProductPageContent, ProductPageContentInput, ProductPageContentOutput } from "@/ai/flows/product-page-assistant";

export async function generateProductContentAction(input: ProductPageContentInput): Promise<ProductPageContentOutput | { error: string }> {
  try {
    const result = await generateProductPageContent(input);
    return result;
  } catch (error) {
    console.error("AI content generation failed:", error);
    return { error: "Failed to generate content. Please try again." };
  }
}
