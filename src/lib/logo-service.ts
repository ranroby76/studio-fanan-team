// src/lib/logo-service.ts
"use client"; 

import type { FirmLogosData } from '@/lib/types';

const LOGOS_CONTENT_STORAGE_KEY = 'fananTeamLogosContent';

export const getLogosContent = (): FirmLogosData | null => {
  if (typeof window === 'undefined') return null;
  const data = localStorage.getItem(LOGOS_CONTENT_STORAGE_KEY);
  try {
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("Failed to parse Logos content from localStorage", error);
    return null;
  }
};

export const saveLogosContent = (content: FirmLogosData): void => {
  if (typeof window === 'undefined') {
    console.error("localStorage not available, cannot save Logos content.");
    return;
  }
  try {
    localStorage.setItem(LOGOS_CONTENT_STORAGE_KEY, JSON.stringify(content));
  } catch (error) {
    console.error("Failed to save Logos content to localStorage", error);
  }
};
