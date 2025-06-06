// src/lib/gui-me-service.ts
"use client"; // This service interacts with localStorage, so it's client-side

import type { GuiMeContent } from '@/lib/types';

const GUI_ME_CONTENT_STORAGE_KEY = 'fananTeamGuiMeContent';

export const getGuiMeContent = (): GuiMeContent | null => {
  if (typeof window === 'undefined') return null;
  const data = localStorage.getItem(GUI_ME_CONTENT_STORAGE_KEY);
  try {
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("Failed to parse GUI ME content from localStorage", error);
    return null;
  }
};

export const saveGuiMeContent = (content: GuiMeContent): void => {
  if (typeof window === 'undefined') {
    console.error("localStorage not available, cannot save GUI ME content.");
    return;
  }
  try {
    localStorage.setItem(GUI_ME_CONTENT_STORAGE_KEY, JSON.stringify(content));
  } catch (error) {
    console.error("Failed to save GUI ME content to localStorage", error);
  }
};
