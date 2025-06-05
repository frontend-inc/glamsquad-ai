'use client';

import { generateId } from 'ai';
import { useChat } from '@ai-sdk/react';
import { useEffect, useRef } from 'react';
import AboutCard from "@/components/cards/aboutcard";
import { Messages } from "@/components/Messages";
import { MessageInput } from "@/components/MessageInput";


export const maxDuration = 30;

export default function Chat() {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const {
    isLoading,
    messages,
    setMessages,
    input,
    handleInputChange,
    handleSubmit,
  } = useChat({
    initialMessages: [],
    api: '/api/chat',    
    onFinish: (message) => {
      console.log('Message finished:', message);
    }
  })

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmitInput = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      handleSubmit()
    } catch (error) {
      // If OpenAI API key is missing or any other error occurs
      setMessages(prev => [
        ...prev,
        {
          id: generateId(),
          role: 'assistant',
          content: "Sorry, I'm unable to respond right now. Please check if the OpenAI API key is configured correctly.", 
        },
      ]);
    }
  }
  
  return (    
    <>
      <div className="group w-full flex flex-col relative">
        <div className="flex-1">
          {messages.length <= 0 ? ( 
            <AboutCard setInput={(text) => handleInputChange({ target: { value: text } } as React.ChangeEvent<HTMLInputElement>)} />  
          ) : (
            <Messages messages={messages} />
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      <div className="fixed bottom-0 left-0 right-0 glass-footer border-t border-gray-200/30 z-40">
        <MessageInput 
          input={input} 
          handleInputChange={handleInputChange} 
          handleSubmit={handleSubmitInput} 
          isDisabled={!input.trim()} 
        />
      </div>
    </>
  );
}