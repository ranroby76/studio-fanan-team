// src/lib/gui-me-service.ts
// This service now reads directly from a JSON file.

import type { GuiMeContent } from '@/lib/types';
import guiMeDefaultData from '@/data/gui-me-content.json';

export const getGuiMeContent = (): GuiMeContent => {
  // Returns the imported JSON data.
  // Type assertion can be used if you are sure the JSON matches the type.
  return guiMeDefaultData as GuiMeContent;
};

// Saving to project files directly from the client/server in a typical web app flow is not handled here.
// The editor pages will guide the user to provide the data to the AI assistant for updating the JSON file.
