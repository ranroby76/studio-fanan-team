// src/lib/gui-me-service.ts
import type { GuiMeContent, GuiMeContentFormData } from '@/lib/types';
import guiMeContent from '@/data/gui-me-content.json';

// The function remains async to align with potential future data fetching strategies,
// but for now it just reads the imported JSON synchronously.
export const getGuiMeContent = async (): Promise<GuiMeContent> => {
  // Directly return the imported JSON content.
  return guiMeContent;
};

// This function is now a helper to generate the JSON string for the editor.
// It does not save anywhere.
export const generateGuiMeJsonString = (data: GuiMeContentFormData): string => {
  return JSON.stringify(data, null, 2);
};
