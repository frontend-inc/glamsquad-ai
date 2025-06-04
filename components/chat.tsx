'use client';

import { generateId } from 'ai';
import { useChat } from '@ai-sdk/react';
import AboutCard from "@/components/cards/aboutcard";
import { Messages } from "@/components/Messages";
import { MessageInput } from "@/components/MessageInput";


export const maxDuration = 30;

export default function Chat() {
  
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
    <div className="group w-full overflow-auto">
      {messages.length <= 0 ? ( 
        <AboutCard setInput={(text) => handleInputChange({ target: { value: text } } as React.ChangeEvent<HTMLInputElement>)} />  
      ) : (
        <Messages messages={messages} />
      )}
      <MessageInput 
        input={input} 
        handleInputChange={handleInputChange} 
        handleSubmit={handleSubmitInput} 
        isDisabled={!input.trim()} 
      />
    </div>
  );
}