'use client';

import { useEffect } from 'react';

export default function EmbedDemoPage() {
  useEffect(() => {
    // Load the embed script
    const script = document.createElement('script');
    script.src = '/embed.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Cleanup: remove script and chatbot elements when component unmounts
      const existingScript = document.querySelector('script[src="/embed.js"]');
      if (existingScript) {
        document.body.removeChild(existingScript);
      }
      const chatbot = document.querySelector('glamsquad-chatbot');
      if (chatbot) {
        chatbot.remove();
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-gray-900">
          GlamSquad AI Chatbot Embed Demo
        </h1>
        
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            How to embed the chatbot
          </h2>
          <p className="text-gray-600 mb-6">
            To add the GlamSquad AI chatbot to your website, simply add the following script tag to your HTML:
          </p>
          <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
            <code className="text-sm">
              {`<script src="${typeof window !== 'undefined' ? window.location.origin : ''}/embed.js"></script>`}
            </code>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Demo
          </h2>
          <p className="text-gray-600 mb-4">
            The chatbot is already loaded on this page. Look for the chat icon in the bottom right corner!
          </p>
          <p className="text-gray-600">
            Click the icon to open the chatbot and start a conversation with our AI assistant.
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-2">Features:</h3>
          <ul className="list-disc list-inside text-blue-800 space-y-1">
            <li>Web component with Shadow DOM for style isolation</li>
            <li>Floating chat button in the bottom right corner</li>
            <li>Click to open the full chatbot interface</li>
            <li>Responsive design that works on all devices</li>
            <li>Easy integration with a single script tag</li>
            <li>Escape key to close the chatbot</li>
          </ul>
        </div>
      </div>
    </div>
  );
}