// src/lib/gui-me-service.ts
import type { GuiMeContent, GuiMeContentFormData } from '@/lib/types';
import localGuiMeDefaultData from '@/data/gui-me-content.json';
import { storage } from './firebase'; // Firebase storage instance
import { ref, getBytes, uploadString } from 'firebase/storage';

const GUI_ME_STORAGE_PATH = 'fanan team/gui-me-content.json';

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
  } catch (error: any) {
    // Log the full error structure for internal debugging if this issue persists
    console.error("Original Firebase Error saving GUI Me content:", JSON.stringify(error, Object.getOwnPropertyNames(error)));
    
    let detailedMessage = 'Failed to save GUI Me content to Firebase Storage.';
    if (error && typeof error === 'object') {
      if ('message' in error && error.message) {
        detailedMessage += ` Firebase Message: ${error.message}`;
      }
      if ('code' in error && error.code) {
        detailedMessage += ` (Code: ${error.code})`;
      }
      // Add name if code is not present but name is, and message doesn't already seem to contain the name.
      if ('name' in error && error.name && !('code' in error && error.code) && !(typeof error.message === 'string' && error.message.includes(error.name as string))) {
        detailedMessage += ` (Name: ${error.name})`;
      }
    } else if (typeof error === 'string') {
      detailedMessage += ` Details: ${error}`;
    }
    throw new Error(detailedMessage);
  }
};
