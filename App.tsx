import React, { useState, useCallback, useMemo } from 'react';
import { ImagePart } from './types';
import { fileToImagePart } from './utils/imageUtils';
import { generateVirtualTryOn } from './services/geminiService';
import ImageUploader from './components/ImageUploader';
import ResultDisplay from './components/ResultDisplay';
import { UserIcon, ShirtIcon, SparklesIcon, PlusIcon } from './components/icons';

const App: React.FC = () => {
  const [personImage, setPersonImage] = useState<ImagePart | null>(null);
  const [outfitImage, setOutfitImage] = useState<ImagePart | null>(null);
  const [personPreview, setPersonPreview] = useState<string | null>(null);
  const [outfitPreview, setOutfitPreview] = useState<string | null>(null);

  const [resultImage, setResultImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [removeOutfitBackground, setRemoveOutfitBackground] = useState<boolean>(true);

  const handleImageUpload = useCallback(async (file: File, type: 'person' | 'outfit') => {
    setError(null);
    setResultImage(null);
    try {
      const imagePart = await fileToImagePart(file);
      const previewUrl = `data:${imagePart.mimeType};base64,${imagePart.data}`;

      if (type === 'person') {
        setPersonImage(imagePart);
        setPersonPreview(previewUrl);
      } else {
        setOutfitImage(imagePart);
        setOutfitPreview(previewUrl);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process image.');
    }
  }, []);

  const handleGenerate = async () => {
    if (!personImage || !outfitImage) {
      setError('Please upload both your photo and an outfit photo.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setResultImage(null);

    try {
      const generatedImage = await generateVirtualTryOn(personImage, outfitImage, removeOutfitBackground);
      setResultImage(generatedImage);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred during generation.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleReset = () => {
    setPersonImage(null);
    setOutfitImage(null);
    setPersonPreview(null);
    setOutfitPreview(null);
    setResultImage(null);
    setError(null);
    setIsLoading(false);
  };

  const isButtonDisabled = useMemo(() => isLoading || !personImage || !outfitImage, [isLoading, personImage, outfitImage]);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-4 sm:p-8 font-sans">
      <header className="w-full max-w-5xl text-center mb-8">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
          StyleMy Outfit
        </h1>
        <p className="mt-4 text-lg text-gray-300">
          See yourself in a new outfit. Upload your photo, pick your clothing, and let AI do the magic.
        </p>
      </header>

      <main className="w-full max-w-5xl flex flex-col items-center">
        <div className="w-full grid grid-cols-1 md:grid-cols-2 md:items-center gap-8 mb-8">
          <div className="flex flex-col sm:flex-row items-start justify-center gap-4 w-full">
            {/* Column 1: Person Uploader */}
            <div className="flex flex-col items-center gap-2">
              <ImageUploader
                id="person-uploader"
                title="Your Photo"
                onImageUpload={(file) => handleImageUpload(file, 'person')}
                previewUrl={personPreview}
                icon={<UserIcon />}
              />
              {/* Placeholder for alignment with checkbox below */}
              <div className="h-7 w-full" aria-hidden="true" />
            </div>
            
            {/* Plus Icon in the middle for desktop */}
            <div className="text-gray-500 hidden sm:block self-center">
              <PlusIcon />
            </div>

            {/* Column 2: Outfit Uploader */}
            <div className="flex flex-col items-center gap-2">
              <ImageUploader
                id="outfit-uploader"
                title="Outfit Photo"
                onImageUpload={(file) => handleImageUpload(file, 'outfit')}
                previewUrl={outfitPreview}
                icon={<ShirtIcon />}
              />
              {/* Checkbox Section */}
              <div className="flex items-center justify-center gap-2 mt-1 w-full h-7">
                <input
                  type="checkbox"
                  id="bg-removal-toggle"
                  checked={removeOutfitBackground}
                  onChange={(e) => setRemoveOutfitBackground(e.target.checked)}
                  className="w-4 h-4 text-purple-500 bg-gray-700 border-gray-500 rounded focus:ring-purple-600 focus:ring-offset-gray-800 focus:ring-2 cursor-pointer"
                />
                <label htmlFor="bg-removal-toggle" className="text-sm font-medium text-gray-300 cursor-pointer">
                  Remove Background
                </label>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center gap-4">
              <button
                onClick={handleGenerate}
                disabled={isButtonDisabled}
                className="w-full max-w-xs flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-full shadow-lg transform transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
              >
                <SparklesIcon />
                {isLoading ? 'Generating...' : 'Try It On!'}
              </button>
              {(resultImage || personPreview || outfitPreview) && (
                 <button
                    onClick={handleReset}
                    className="w-full max-w-xs text-sm text-gray-400 hover:text-white transition-colors"
                >
                    Start Over
                </button>
              )}
          </div>
        </div>

        <ResultDisplay
          isLoading={isLoading}
          resultImage={resultImage}
          error={error}
        />
      </main>
      
      <footer className="w-full max-w-5xl text-center mt-12 text-gray-500 text-sm">
        <p>Powered by StyleMy Outfit. Images are processed by AI and may not be perfect.</p>
      </footer>
    </div>
  );
};

export default App;