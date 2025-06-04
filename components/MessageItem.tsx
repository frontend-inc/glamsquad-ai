'use client';

import { Message } from 'ai';
import { cn } from '@/lib/utils';
import { parse } from 'partial-json';

interface MessageItemProps {
  message: Message;
}

export function MessageItem({ message }: MessageItemProps) {
  const renderAssistantMessage = (content: string) => {
    try {
      const parsedContent = parse(content);
      
      // Check if we have a valid message object
      if (parsedContent && typeof parsedContent === 'object' && 'message' in parsedContent) {
        const messageText = parsedContent.message as string;
        
        return (
          <>
            <div className="max-w-none">
              {messageText}
            </div>
          </>
        );
      }
    } catch (error) {
      // If parsing fails, return the content as is
    }
    
    // Default fallback rendering
    return (
      <div className="prose prose-sm max-w-none">
        {content}
      </div>
    );
  };
  return (
    <div className={cn(
      "whitespace-pre-wrap flex mb-5 w-full",
      message.role === 'user' ? 'justify-end' : 'justify-start'
    )}>
      <div className={cn(
        "p-3 rounded-lg max-w-[80%]",
        message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-foreground text-background',        
      )}>
        {message.role === 'user' ? 
          (message.content as string) : 
          renderAssistantMessage(message.content as string)
        }
      </div>
    </div>
  );
}