// src/app/icon.tsx
import { ImageResponse } from 'next/og';
import fs from 'fs/promises';
import path from 'path';

// Route segment config
export const runtime = 'edge';

// Image metadata
export const size = {
  width: 200,
  height: 200,
};

export const contentType = 'image/png';

// Image generation
export default async function Icon() {
  try {
    const imagePath = path.join(process.cwd(), 'public', 'favicon.png');
    const imageData = await fs.readFile(imagePath);
    
    return new ImageResponse(
      (
        <img
          width={size.width}
          height={size.height}
          src={imageData as any}
          alt="Fanan Team Favicon"
        />
      ),
      {
        ...size,
      }
    );
  } catch (e) {
    console.error("Failed to load favicon.png, using fallback.", e);
    // Fallback if the image cannot be read
    return new ImageResponse(
      (
        <div
          style={{
            fontSize: 128,
            background: 'black',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontFamily: 'monospace',
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
