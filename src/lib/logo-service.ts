// src/lib/logo-service.ts
"use client"; // This service now interacts with localStorage, so it's client-side

import type { FirmLogosData, FirmLogosFormData } from '@/lib/types';
import localLogosDefaultData from '@/data/logos-content.json';

const LOGOS_STORAGE_KEY = 'fananTeamLogosContent';

// The function remains async to avoid breaking the components that call it.
export const getLogosContent = async (): Promise<FirmLogosData> => {
  if (typeof window === 'undefined') {
    return localLogosDefaultData as FirmLogosData;
  }
  try {
    const data = localStorage.getItem(LOGOS_STORAGE_KEY);
    const storedData = data ? JSON.parse(data) : {};
    // Merge with local defaults to ensure all keys are present
    return { ...localLogosDefaultData, ...storedData };
  } catch (error: any) {
    console.error("Error fetching logos content from localStorage:", error);
    return localLogosDefaultData as FirmLogosData;
  }
};

// The function remains async to avoid breaking the components that call it.
export const saveLogosContent = async (data: FirmLogosFormData): Promise<void> => {
  if (typeof window === 'undefined') {
    throw new Error('localStorage is not available on the server.');
  }
  try {
    const jsonString = JSON.stringify(data, null, 2);
    localStorage.setItem(LOGOS_STORAGE_KEY, jsonString);
    console.log("Logos content saved to localStorage.");
  } catch (error: any) {
    console.error("Error saving Logos content to localStorage:", error);
    throw new Error('Failed to save Logos content to localStorage.');
  }
};
