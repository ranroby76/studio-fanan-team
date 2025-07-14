// src/lib/logo-service.ts
import type { FirmLogosData } from '@/lib/types';
import logosContent from '@/data/logos-content.json';

// The function remains async to align with potential future data fetching strategies,
// but for now it just reads the imported JSON synchronously.
export const getLogosContent = async (): Promise<FirmLogosData> => {
  // Directly return the imported JSON content.
  // The default values are now effectively managed within the JSON file itself.
  return logosContent;
};

// This function is now a helper to generate the JSON string for the editor.
// It does not save anywhere.
export const generateLogosJsonString = (data: FirmLogosData): string => {
  return JSON.stringify(data, null, 2);
};
