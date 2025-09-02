
import { ImagePart } from '../types';

export const fileToImagePart = (file: File): Promise<ImagePart> => {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      return reject(new Error('File is not an image. Please select a JPG, PNG, or other image file.'));
    }

    if (file.size > 4 * 1024 * 1024) { // 4MB limit
        return reject(new Error('Image size exceeds 4MB. Please upload a smaller file.'));
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        // result is a data URL like "data:image/jpeg;base64,...."
        const base64Data = result.split(',')[1];
        if (!base64Data) {
          reject(new Error('Could not extract image data from file.'));
          return;
        }
        resolve({
          mimeType: file.type,
          data: base64Data,
        });
      } else {
        reject(new Error('Failed to read file.'));
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};
