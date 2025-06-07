// src/lib/logo-service.ts
import type { FirmLogosData, FirmLogosFormData } from '@/lib/types';
import localLogosDefaultData from '@/data/logos-content.json';
import { storage } from './firebase'; // Firebase storage instance
import { ref, getBytes, uploadString } from 'firebase/storage';

const LOGOS_STORAGE_PATH = 'app-config/logos-content.json';

export const getLogosContent = async (): Promise<FirmLogosData> => {
  try {
    const storageRef = ref(storage, LOGOS_STORAGE_PATH);
    const bytes = await getBytes(storageRef);
    const jsonString = new TextDecoder().decode(bytes);
    const data = JSON.parse(jsonString);
     // Merge with local defaults to ensure all keys are present
    return { ...localLogosDefaultData, ...data } as FirmLogosData;
  } catch (error: any) {
    if (error.code === 'storage/object-not-found') {
      console.warn(`Logos content not found in Storage at ${LOGOS_STORAGE_PATH}, using local defaults.`);
    } else {
      console.error("Error fetching logos content from Firebase Storage:", error);
    }
    return localLogosDefaultData as FirmLogosData;
  }
};

export const saveLogosContent = async (data: FirmLogosFormData): Promise<void> => {
  try {
    const storageRef = ref(storage, LOGOS_STORAGE_PATH);
    const jsonString = JSON.stringify(data, null, 2);
    await uploadString(storageRef, jsonString, 'raw', { contentType: 'application/json' });
    console.log("Logos content saved to Firebase Storage.");
  } catch (error) {
    console.error("Error saving logos content to Firebase Storage:", error);
    throw new Error('Failed to save logos content to Firebase Storage.');
  }
};
