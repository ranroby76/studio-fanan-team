// src/lib/gui-me-service.ts
import type { GuiMeContent, GuiMeContentFormData } from '@/lib/types';
import localGuiMeDefaultData from '@/data/gui-me-content.json';
import { storage } from './firebase'; // Firebase storage instance
import { ref, getBytes, uploadString } from 'firebase/storage';

const GUI_ME_STORAGE_PATH = 'app-config/gui-me-content.json';

export const getGuiMeContent = async (): Promise<GuiMeContent> => {
  try {
    const storageRef = ref(storage, GUI_ME_STORAGE_PATH);
    const bytes = await getBytes(storageRef);
    const jsonString = new TextDecoder().decode(bytes);
    const data = JSON.parse(jsonString);
    // Merge with local defaults to ensure all keys are present if the stored JSON is partial
    return { ...localGuiMeDefaultData, ...data } as GuiMeContent;
  } catch (error: any) {
    // If file not found (404) or other error, fallback to local default data
    if (error.code === 'storage/object-not-found') {
      console.warn(`GUI Me content not found in Storage at ${GUI_ME_STORAGE_PATH}, using local defaults.`);
    } else {
      console.error("Error fetching GUI Me content from Firebase Storage:", error);
    }
    return localGuiMeDefaultData as GuiMeContent;
  }
};

export const saveGuiMeContent = async (data: GuiMeContentFormData): Promise<void> => {
  try {
    const storageRef = ref(storage, GUI_ME_STORAGE_PATH);
    const jsonString = JSON.stringify(data, null, 2);
    await uploadString(storageRef, jsonString, 'raw', { contentType: 'application/json' });
    console.log("GUI Me content saved to Firebase Storage.");
  } catch (error) {
    console.error("Error saving GUI Me content to Firebase Storage:", error);
    throw new Error('Failed to save GUI Me content to Firebase Storage.');
  }
};
