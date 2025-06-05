'use client';

import { Message } from 'ai';
import { MessageItem } from "@/components/MessageItem";

interface MessagesProps {
  messages: Message[];
  onSendMessage?: (message: string) => void;
}

export function Messages({ messages, onSendMessage }: MessagesProps) {
  return (
    <div className="w-full md:w-[540px] mx-auto mt-10">
      {messages.map((message, index) => (
        <MessageItem key={index} message={message} onSendMessage={onSendMessage} />
      ))}
    </div>
  );
}