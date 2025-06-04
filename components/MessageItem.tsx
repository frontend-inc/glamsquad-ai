'use client';

import { Message } from 'ai';
import { cn } from '@/lib/utils';
import { parse } from 'partial-json';
import { ServicesGrid } from './ServicesGrid';
import { AvailabilityGrid } from './AvailabilityGrid';

interface MessageItemProps {
  message: Message;
}

export function MessageItem({ message }: MessageItemProps) {
  
  const renderToolInvocationResult = (toolInvocation: any) => {
    
    if (toolInvocation.state !== 'result' || !toolInvocation.result) {
      return null;
    }

    switch (toolInvocation.toolName) {
      case 'greetUser':
        return (
          <div className="max-w-none">
            {toolInvocation.result.message}
          </div>
        );
      case 'queryServices':
        if (toolInvocation.result.services) {
          return (
            <ServicesGrid 
              services={toolInvocation.result.services} 
              message={toolInvocation.result.message}
            />
          );
        }
        return (
          <div className="max-w-none">
            {toolInvocation.result.message}
          </div>
        );
      case 'queryAvailability':
        if (toolInvocation.result.availability) {
          return (
            <AvailabilityGrid 
              availability={toolInvocation.result.availability} 
              message={toolInvocation.result.message}
            />
          );
        }
        return (
          <div className="max-w-none">
            {toolInvocation.result.message}
          </div>
        );
      default:
        return (
          <div className="max-w-none">
            {JSON.stringify(toolInvocation.result)}
          </div>
        );
    }
  };

  const renderAssistantMessage = (content: string) => {
    // @ts-ignore
    if (message?.parts && message.parts?.length > 0) {
      return (
        <>
          {
            // @ts-ignore
            message.parts.map((part: any, index: number) => {
            if (part.toolInvocation) {
              return (
                <div key={index}>
                  {renderToolInvocationResult(part.toolInvocation)}
                </div>
              );
            }
            
            if (part.type === 'text' && part.text) {
              try {
                const parsedContent = parse(part.text);
                if (parsedContent && typeof parsedContent === 'object' && 'message' in parsedContent) {
                  return (
                    <div key={index} className="max-w-none">
                      {parsedContent.message}
                    </div>
                  );
                }
              } catch (error) {
                // If parsing fails, return the text as is
                return (
                  <div key={index} className="max-w-none">
                    {part.text}
                  </div>
                );
              }
            }
            
            return null;
          })}
        </>
      );
    }

    // If no parts, always display the content
    return (
      <div className="max-w-none">
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