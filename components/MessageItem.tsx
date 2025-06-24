'use client';

import { Message } from 'ai';
import { cn } from '@/lib/utils';
import { parse } from 'partial-json';
import { ServicesGrid } from './ServicesGrid';
import { AvailabilityGrid } from './AvailabilityGrid';
import { UserDetails } from './UserDetails';
import { AppointmentDetails } from './AppointmentDetails';
import { AIAvatar } from './AIAvatar';
import { LoadingDots } from './LoadingDots';
import { BookingConfirmationWrapper } from './BookingConfirmationWrapper';
import { RescheduleConfirmationWrapper } from './RescheduleConfirmationWrapper';
import { ArticleCard } from './ArticleCard';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { SimpleMarkdown } from './SimpleMarkdown';

interface MessageItemProps {
  message: Message;
  onSendMessage?: (message: string) => void;
}

export function MessageItem({ message, onSendMessage }: MessageItemProps) {
  const [showAllArticles, setShowAllArticles] = useState(false);
  
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
              onSendMessage={onSendMessage}
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
      case 'queryMe':
        if (toolInvocation.result.user) {
          const users = Array.isArray(toolInvocation.result.user) 
            ? toolInvocation.result.user 
            : [toolInvocation.result.user];
          
          return (
            <div className="space-y-4">
              <div className="max-w-none">
                {toolInvocation.result.message}
              </div>
              {users.map((user: any) => (
                <UserDetails key={user.id} user={user} onSendMessage={onSendMessage} />
              ))}
            </div>
          );
        }
        return (
          <div className="max-w-none">
            {toolInvocation.result.message}
          </div>
        );
      case 'createAppointment':
        if (toolInvocation.result.bookingParams) {
          return (
            <BookingConfirmationWrapper
              bookingParams={toolInvocation.result.bookingParams}
              onSendMessage={onSendMessage}
              message={toolInvocation.result.message}
            />
          );
        }
        return (
          <div className="max-w-none">
            {toolInvocation.result.message}
          </div>
        );
      case 'updateAppointment':
        if (toolInvocation.result.rescheduleParams) {
          return (
            <RescheduleConfirmationWrapper
              rescheduleParams={toolInvocation.result.rescheduleParams}
              address={toolInvocation.result.rescheduleParams.address}
              onSendMessage={onSendMessage}
              message={toolInvocation.result.message}
            />
          );
        }
        if (toolInvocation.result.appointment) {
          return (
            <div className="space-y-4">
              <div className="max-w-none">
                {toolInvocation.result.message}
              </div>
              <AppointmentDetails appointment={toolInvocation.result.appointment} />
            </div>
          );
        }
        return (
          <div className="max-w-none">
            {toolInvocation.result.message}
          </div>
        );
      case 'queryArticles':
        const articles = toolInvocation.result.articles || [];
        const displayedArticles = showAllArticles ? articles : articles.slice(0, 3);
        
        return (
          <div className="space-y-4">
            <SimpleMarkdown className="max-w-none">
              {toolInvocation.result.message}
            </SimpleMarkdown>
            {articles.length > 0 && (
              <>
                <div className="space-y-2">
                  {displayedArticles.map((article: any, index: number) => (
                    <ArticleCard
                      key={index}
                      article={ article }                    
                    />
                  ))}
                </div>
                {articles.length > 3 && (
                  <Button
                    onClick={() => setShowAllArticles(!showAllArticles)}
                    variant="outline"
                    className="w-full"
                  >
                    {showAllArticles ? 'Show Less' : `Show More (${articles.length - 3} more)`}
                  </Button>
                )}
              </>
            )}
          </div>
        );
      default:
        return null;
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
                    <div key={index} className="max-w-none text-foreground">
                      <SimpleMarkdown>{parsedContent.message}</SimpleMarkdown>
                    </div>
                  );
                }
              } catch (error) {
                // If parsing fails, return the text as is
                return (
                  <div key={index} className="max-w-none text-foreground">
                    <SimpleMarkdown>{part.text}</SimpleMarkdown>
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
      <div className="max-w-none text-foreground">
        <SimpleMarkdown>{content}</SimpleMarkdown>
      </div>
    );
  };
  return (
    <div className={cn(
      "whitespace-pre-wrap flex mb-5 w-full",
      message.role === 'user' ? 'justify-end' : 'justify-start'
    )}>
      {message.role === 'assistant' && (
        <div className="mr-3 flex-shrink-0">
          <AIAvatar size="sm" className="mx-0" />
        </div>
      )}
      <div className={cn(
        "p-3 rounded-lg max-w-[80%]",
        message.role === 'user' ? 'bg-primary text-primary-foreground' : 'text-gray-900',        
      )}
      style={message.role === 'assistant' ? { backgroundColor: '#F9F4EE' } : undefined}>
        {message.role === 'user' ? 
          (message.content as string) : 
          renderAssistantMessage(message.content as string)
        }
      </div>
    </div>
  );
}