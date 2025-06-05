'use client';

import { Message } from 'ai';
import { MessageItem } from "@/components/MessageItem";

interface MessagesProps {
  messages: Message[];
}

export function Messages({ messages }: MessagesProps) {
  return (
    <div className="w-full md:w-[540px] mx-auto mt-10">
      {messages.map((message, index) => (
        <MessageItem key={index} message={message} />
      ))}
    </div>
  );
}