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
import ReactMarkdown from 'react-markdown';
import { BookingConfirmationWrapper } from './BookingConfirmationWrapper';
import { RescheduleConfirmationWrapper } from './RescheduleConfirmationWrapper';

interface MessageItemProps {
  message: Message;
  onSendMessage?: (message: string) => void;
}

export function MessageItem({ message, onSendMessage }: MessageItemProps) {
  
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
      case 'queryUserByEmail':
      case 'queryUserByPhone':
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
                    <div key={index} className="max-w-none text-foreground">
                      <ReactMarkdown>{parsedContent.message}</ReactMarkdown>
                    </div>
                  );
                }
              } catch (error) {
                // If parsing fails, return the text as is
                return (
                  <div key={index} className="max-w-none text-foreground">
                    <ReactMarkdown>{part.text}</ReactMarkdown>
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
        <ReactMarkdown>{content}</ReactMarkdown>
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