'use client';

import { useState, useRef } from 'react';
import { generateCaption } from '../lib/gemini';
import Image from 'next/image';
import { FiUploadCloud, FiCopy, FiCheck } from 'react-icons/fi';

interface Caption {
  imageUrl: string;
  caption: string;
}

export default function ChatInterface() {
  const [captions, setCaptions] = useState<Caption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      await processImage(file);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await processImage(file);
    }
  };

  const processImage = async (file: File) => {
    setIsLoading(true);
    try {
      const imageUrl = URL.createObjectURL(file);
      const caption = await generateCaption(file);
      setCaptions(prev => [{ imageUrl, caption }, ...prev]);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleCopy = async (caption: string, index: number) => {
    await navigator.clipboard.writeText(caption);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-8">
      <div 
        className={`relative border-2 border-dashed rounded-xl p-8 transition-colors ${
          dragActive 
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          disabled={isLoading}
          className="hidden"
          id="imageUpload"
        />
        <label
          htmlFor="imageUpload"
          className="flex flex-col items-center justify-center cursor-pointer"
        >
          <FiUploadCloud className="w-12 h-12 text-gray-400 dark:text-gray-500 mb-4" />
          <div className="text-center">
            <p className="text-lg font-medium text-gray-900 dark:text-white">
              Drop your image here, or{' '}
              <span className="text-blue-500">browse</span>
            </p>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Supports JPG, PNG, WEBP
            </p>
          </div>
        </label>
        {isLoading && (
          <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 flex items-center justify-center rounded-xl">
            <div className="flex items-center space-x-3">
              <div className="h-4 w-4 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="h-4 w-4 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="h-4 w-4 bg-blue-500 rounded-full animate-bounce"></div>
            </div>
          </div>
        )}
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {captions.map((item, index) => (
          <div 
            key={index} 
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700 transition-transform hover:scale-[1.02]"
          >
            <div className="relative aspect-square">
              <Image
                src={item.imageUrl}
                alt="Uploaded image"
                fill
                className="object-cover"
              />
            </div>
            <div className="p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                Generated Caption
              </h3>
              <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap mb-4">
                {item.caption}
              </p>
              <button
                onClick={() => handleCopy(item.caption, index)}
                className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  copiedIndex === index
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {copiedIndex === index ? (
                  <>
                    <FiCheck className="w-4 h-4" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <FiCopy className="w-4 h-4" />
                    <span>Copy Caption</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 