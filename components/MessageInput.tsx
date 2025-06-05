'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowUpIcon } from "lucide-react";

interface MessageInputProps {
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  isDisabled: boolean;
}

export function MessageInput({ input, handleInputChange, handleSubmit, isDisabled }: MessageInputProps) {
  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xl mx-auto">
      <div className="flex gap-2 p-4">
        <Input
          type="text"
          value={input}
          onChange={handleInputChange}
          className="chat-input flex-1 bg-white/80 backdrop-blur-sm border-gray-200"
          placeholder='How can I help you today?'
        />
        <Button disabled={isDisabled} size="icon" className="shrink-0">
          <ArrowUpIcon className="h-4 w-4" />
        </Button>
      </div>              
    </form>
  );
}