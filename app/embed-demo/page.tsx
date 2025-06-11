'use client';

import { useState, useEffect } from 'react';

export default function EmbedDemoPage() {

  const chatbotUrl = process.env.NEXT_PUBLIC_CHATBOT_URL

  useEffect(() => {
    return () => {
      // Cleanup: remove chatbot element when component unmounts
      const chatbot = document.querySelector('chat-bot-widget');
      if (chatbot) {
        chatbot.remove();
      }
    };
  }, []);

  return (
    <>
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-gray-900">
            Chatbot Embed Demo
          </h1>
          
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              How to embed the chatbot
            </h2>
            <p className="text-gray-600 mb-6">
              To add the chatbot to your website, you have two options:
            </p>
            
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2 text-gray-700">Option 1: Auto-initialize with script tag</h3>
              <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto mb-4">
                <code className="text-sm">
                  {`<script src="https://your-domain.com/embed.js" data-auto-init="true"></script>`}
                </code>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2 text-gray-700">Option 2: Use Web Component directly</h3>
              <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                <code className="text-sm">
                  {`<chat-bot-widget src="https://your-domain.com" width="400px" height="600px"></chat-bot-widget>`}
                </code>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              Demo
            </h2>
            <p className="text-gray-600 mb-4">
              The chatbot is already loaded on this page using the Web Component. Look for the chat icon in the bottom right corner!
            </p>
            <p className="text-gray-600">
              Click the icon to open the chatbot and start a conversation with our AI assistant.
            </p>
          </div>
        </div>
      </div>
      
      {/*//@ts-ignore */}
      <chat-bot-widget src={chatbotUrl} width="400px" height="600px" />
    </>
  );
}