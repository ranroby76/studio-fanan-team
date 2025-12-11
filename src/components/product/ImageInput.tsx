// src/components/product/ImageInput.tsx
"use client";

import { Input } from "@/components/ui/input";
import React from 'react';

// This is a separate, focused client component for handling image inputs.
// Its small size and clear dependencies make it easy for the Next.js bundler to analyze.
const ImageInput = ({
  fieldName,
  register,
  errors,
  setValue,
}: {
  fieldName: `mainImage` | `thumbnails.${number}`;
  register: any;
  errors?: any;
  setValue: any;
}) => {

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    // Enforce lowercase filenames on blur
    setValue(fieldName + '.filename', event.target.value.toLowerCase(), { shouldValidate: true });
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-[1fr_80px_80px] gap-2 items-center">
      <Input
        {...register(`${fieldName}.filename`)}
        placeholder={fieldName.startsWith('main') ? "main-image.png" : "thumbnail.png"}
        onBlur={handleBlur}
      />
      <Input {...register(`${fieldName}.width`)} type="number" placeholder="W" />
      <Input {...register(`${fieldName}.height`)} type="number" placeholder="H" />
      {errors?.filename && <p className="text-sm text-destructive mt-1 sm:col-span-3">{errors.filename.message}</p>}
      {errors?.width && <p className="text-sm text-destructive mt-1 sm:col-span-3">{errors.width.message}</p>}
      {errors?.height && <p className="text-sm text-destructive mt-1 sm:col-span-3">{errors.height.message}</p>}
    </div>
  );
};

export default ImageInput;
