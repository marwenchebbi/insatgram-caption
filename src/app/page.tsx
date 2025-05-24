'use client';

import ChatInterface from '../components/ChatInterface';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="bg-white dark:bg-gray-800 shadow-lg border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl">
              Instagram Caption Generator
            </h1>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-300 sm:mt-4">
              Transform your photos into engaging Instagram posts with AI-powered captions and hashtags
            </p>
          </div>
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <ChatInterface />
      </div>
    </main>
  );
}
