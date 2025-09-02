
import { GoogleGenAI, GenerateContentResponse, Modality } from "@google/genai";
import { ImagePart } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateVirtualTryOn = async (personImage: ImagePart, outfitImage: ImagePart, removeBackground: boolean): Promise<string> => {
  const model = 'gemini-2.5-flash-image-preview';

  let prompt = `You will be given two images. The first is a person, the second is an article of clothing. Your task is to perform a virtual try-on.`;
  if (removeBackground) {
    prompt += ` First, you MUST isolate the clothing item from its background in the second image.`;
  }
  prompt += ` After isolating the clothing, realistically place it onto the person from the first image. The clothing must conform to the person's body shape, posture, and any visible perspective. It is crucial that you preserve the person's original appearance (face, hair, skin tone) and the background from the first image. The final result should be a single, high-quality, photorealistic image.`;


  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          { inlineData: { data: personImage.data, mimeType: personImage.mimeType } },
          { inlineData: { data: outfitImage.data, mimeType: outfitImage.mimeType } },
          { text: prompt },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });
    
    // Find the image part in the response
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        const base64ImageBytes: string = part.inlineData.data;
        return `data:${part.inlineData.mimeType};base64,${base64ImageBytes}`;
      }
    }
    
    // If no image is found, there might be a text response (e.g., safety refusal)
    let textResponse = '';
    for (const part of response.candidates[0].content.parts) {
      if (part.text) {
        textResponse += part.text + ' ';
      }
    }
    if (textResponse) {
        throw new Error(`Model returned a text response instead of an image: ${textResponse.trim()}`);
    }

    throw new Error("No image data found in the Gemini API response.");

  } catch (error) {
    console.error("Error generating virtual try-on:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    throw new Error(`Failed to generate image. ${errorMessage}`);
  }
};
