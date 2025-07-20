// src/app/icon.tsx
import { ImageResponse } from 'next/og';
import fs from 'fs/promises';
import path from 'path';

// Route segment config
export const runtime = 'edge';

// Image metadata
export const size = {
  width: 32,
  height: 32,
};
export const contentType = 'image/png';

// Image generation
export default async function Icon() {
  try {
    // We are now reading the favicon.png directly from the public folder.
    const imagePath = path.join(process.cwd(), 'public', 'favicon.png');
    const imageBuffer = await fs.readFile(imagePath);
    const base64Image = Buffer.from(imageBuffer).toString('base64');
    const dataUri = `data:image/png;base64,${base64Image}`;

    return new ImageResponse(
      (
        <div
          style={{
            fontSize: 24,
            background: 'transparent',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <img 
            src={dataUri} 
            width="32" 
            height="32" 
            alt="Fanan Team Logo" 
          />
        </div>
      ),
      {
        ...size,
      }
    );
  } catch (error) {
    console.error("Error generating icon:", error);
    // Return a default response in case of error
    return new ImageResponse(
      (
        <div
          style={{
            fontSize: 24,
            background: 'black',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
          }}
        >
          F
        </div>
      ),
      {
        ...size,
      }
    );
  }
}
