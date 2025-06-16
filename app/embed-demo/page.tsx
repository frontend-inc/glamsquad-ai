'use client';

import { useState, useEffect } from 'react';
import AuthModal from '@/components/auth/auth-modal';
import { Button } from '@/components/ui/button';

export default function EmbedDemoPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const chatbotUrl = process.env.NEXT_PUBLIC_CHATBOT_URL

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('accessToken');
    const email = localStorage.getItem('userEmail');
    if (token) {
      setIsLoggedIn(true);
      setUserEmail(email);
    }

    return () => {
      // Cleanup: remove chatbot element when component unmounts
      const chatbot = document.querySelector('chat-bot-widget');
      if (chatbot) {
        chatbot.remove();
      }
    };
  }, []);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    const email = localStorage.getItem('userEmail');
    setUserEmail(email);
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userEmail');
    setIsLoggedIn(false);
    setUserEmail(null);
  };

  return (
    <>
      <div className="min-h-screen p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900">
              Chatbot Embed Demo
            </h1>
            <div className="flex items-center gap-4">
              {isLoggedIn && userEmail && (
                <span className="text-gray-700">
                  Welcome, {userEmail}!
                </span>
              )}
              {isLoggedIn ? (
                <Button onClick={handleLogout} variant="outline">
                  Logout
                </Button>
              ) : (
                <AuthModal 
                  triggerElement={<Button>Login</Button>}
                  onClose={handleLoginSuccess}
                />
              )}
            </div>
          </div>
          
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
                  {`<script src="https://supabase.frontend.com/assets/embed.js"></script>`}
                </code>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2 text-gray-700">Option 2: Use Web Component directly</h3>
              <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                <code className="text-sm">
                  {`<chat-bot-widget 
  src="https://www.frontend.co/agents/my-agent" 
  width="400px" 
  height="600px"
></chat-bot-widget>`}
                </code>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2 text-gray-700">Customization Options</h3>
              <p className="text-gray-600 mb-3">You can customize the chatbot appearance with the following attributes:</p>
              <ul className="list-disc list-inside text-gray-600 mb-4">
                <li><code className="bg-gray-100 px-1">width</code> - Width of the chat container (default: 400px)</li>
                <li><code className="bg-gray-100 px-1">height</code> - Height of the chat container (default: 600px)</li>
                <li><code className="bg-gray-100 px-1">color</code> - Primary color for the chat icon and header (default: #000)</li>
              </ul>
              <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                <code className="text-sm">
                  {`<!-- Example with custom color -->
<chat-bot-widget 
  src="https://www.frontend.co/agents/my-agent" 
  width="400px" 
  height="600px"
  color="#7C3AED"
></chat-bot-widget>`}
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
      <chat-bot-widget src={chatbotUrl} width="400px" height="640px" color="#0E2C86" />
    </>
  );
}