// src/lib/image-service.ts
'use server';

import fs from 'fs/promises';
import path from 'path';
import imageSize from 'image-size';
import type { ISizeCalculationResult } from 'image-size/dist/types/interface';

interface DimensionResult {
  width?: number;
  height?: number;
  error?: string;
}

const PUBLIC_DIR = path.join(process.cwd(), 'public');

export const getImageDimensions = async (filename: string): Promise<DimensionResult> => {
  if (!filename || typeof filename !== 'string') {
    return { error: 'Invalid filename provided.' };
  }
  
  // Basic security check to prevent path traversal
  if (filename.includes('..') || filename.startsWith('/')) {
    return { error: 'Invalid filename format.' };
  }
  
  // The filename should already be lowercase from the client, but we enforce it here as a fallback.
  const lowerCaseFilename = filename.toLowerCase();
  const imagePath = path.join(PUBLIC_DIR, 'images', lowerCaseFilename);

  try {
    // Check if the file exists first
    await fs.access(imagePath);
    
    // Get image dimensions
    const dimensions: ISizeCalculationResult = imageSize(imagePath);
    
    if (dimensions.width && dimensions.height) {
      return { width: dimensions.width, height: dimensions.height };
    } else {
      return { error: 'Could not determine image dimensions.' };
    }
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      // Provide a more helpful error message
      return { error: `File not found. Ensure '${lowerCaseFilename}' exists in 'public/images/' (case-insensitive).` };
    }
    console.error(`Error processing image ${lowerCaseFilename}:`, error);
    return { error: 'An error occurred while reading the image file.' };
  }
};
