
import React, { useRef, useState } from 'react';

interface ImageUploaderProps {
  id: string;
  title: string;
  onImageUpload: (file: File) => void;
  previewUrl: string | null;
  icon: React.ReactNode;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ id, title, onImageUpload, previewUrl, icon }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageUpload(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); // This is necessary to allow for dropping
    e.stopPropagation();
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      onImageUpload(file);
    }
  };


  return (
    <div
      className={`w-full h-64 sm:w-64 sm:h-64 flex flex-col items-center justify-center bg-gray-800 border-2 border-dashed rounded-xl text-gray-400 cursor-pointer transition-all duration-300 relative overflow-hidden ${isDragging ? 'border-purple-500 bg-gray-700/50 text-purple-400' : 'border-gray-600 hover:border-purple-500 hover:text-purple-400'}`}
      onClick={handleClick}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <input
        id={id}
        ref={fileInputRef}
        type="file"
        accept="image/png, image/jpeg, image/webp"
        className="hidden"
        onChange={handleFileChange}
      />
      {previewUrl ? (
        <img src={previewUrl} alt={title} className="w-full h-full object-cover" />
      ) : (
        <div className="flex flex-col items-center gap-2 text-center p-4 pointer-events-none">
          {icon}
          <span className="font-semibold">{title}</span>
          <span className="text-xs">{isDragging ? 'Drop image here' : 'Click or drag to upload'}</span>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
