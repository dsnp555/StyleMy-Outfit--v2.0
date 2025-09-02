
import React, { useEffect, useState } from 'react';
import { DownloadIcon, ExclamationIcon } from './icons';

interface ResultDisplayProps {
  isLoading: boolean;
  resultImage: string | null;
  error: string | null;
}

const loadingMessages = [
  "Warming up the virtual dressing room...",
  "Analyzing your style...",
  "Tailoring the outfit to fit perfectly...",
  "Adding the finishing touches...",
  "Almost ready for your big reveal!",
];

const ResultDisplay: React.FC<ResultDisplayProps> = ({ isLoading, resultImage, error }) => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setCurrentMessageIndex((prevIndex) => (prevIndex + 1) % loadingMessages.length);
      }, 2500);
      return () => clearInterval(interval);
    }
  }, [isLoading]);

  return (
    <section className="w-full bg-gray-800/50 border border-gray-700 rounded-2xl p-4 sm:p-8 flex items-center justify-center min-h-[400px] shadow-inner">
      {isLoading && (
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="w-16 h-16 border-4 border-dashed border-purple-400 rounded-full animate-spin"></div>
          <h3 className="text-xl font-semibold text-gray-200">Creating Your Look</h3>
          <p className="text-gray-400 transition-opacity duration-500">{loadingMessages[currentMessageIndex]}</p>
        </div>
      )}

      {error && (
        <div className="flex flex-col items-center gap-4 text-center text-red-400">
          <ExclamationIcon />
          <h3 className="text-xl font-semibold">Oops! Something went wrong.</h3>
          <p className="text-sm max-w-md">{error}</p>
        </div>
      )}

      {resultImage && !isLoading && (
        <div className="flex flex-col items-center gap-4">
          <h3 className="text-2xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 mb-4">Here's Your New Look!</h3>
          <div className="relative group">
            <img src={resultImage} alt="Virtual try-on result" className="rounded-xl shadow-2xl max-w-full h-auto max-h-[60vh]" />
            <a
              href={resultImage}
              download="virtual-try-on.png"
              className="absolute bottom-4 right-4 bg-black/50 p-3 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-sm"
              aria-label="Download Image"
            >
              <DownloadIcon />
            </a>
          </div>
        </div>
      )}

      {!isLoading && !resultImage && !error && (
        <div className="text-center text-gray-500">
          <h3 className="text-xl font-medium">Your result will appear here</h3>
          <p>Upload both images and click "Try It On!" to get started.</p>
        </div>
      )}
    </section>
  );
};

export default ResultDisplay;
