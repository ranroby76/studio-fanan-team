// src/lib/gui-me-service.ts
"use client"; // This service now interacts with localStorage, so it's client-side

import type { GuiMeContent, GuiMeContentFormData } from '@/lib/types';
import localGuiMeDefaultData from '@/data/gui-me-content.json';

const GUI_ME_STORAGE_KEY = 'fananTeamGuiMeContent';

// The function remains async to avoid breaking the components that call it.
export const getGuiMeContent = async (): Promise<GuiMeContent> => {
  if (typeof window === 'undefined') {
    return localGuiMeDefaultData as GuiMeContent;
  }
  try {
    const data = localStorage.getItem(GUI_ME_STORAGE_KEY);
    const storedData = data ? JSON.parse(data) : {};
    // Merge with local defaults to ensure all keys are present if the stored JSON is partial
    return { ...localGuiMeDefaultData, ...storedData };
  } catch (error: any) {
    console.error("Error fetching GUI Me content from localStorage:", error);
    return localGuiMeDefaultData as GuiMeContent;
  }
};

// The function remains async to avoid breaking the components that call it.
export const saveGuiMeContent = async (data: GuiMeContentFormData): Promise<void> => {
  if (typeof window === 'undefined') {
    throw new Error('localStorage is not available on the server.');
  }
  try {
    const jsonString = JSON.stringify(data, null, 2);
    localStorage.setItem(GUI_ME_STORAGE_KEY, jsonString);
    console.log("GUI Me content saved to localStorage.");
  } catch (error: any) {
    console.error("Error saving GUI Me content to localStorage:", error);
    throw new Error('Failed to save GUI Me content to localStorage.');
  }
};
