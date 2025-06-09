'use client';

import { useRef, useEffect } from 'react';
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
  const inputRef = useRef<HTMLInputElement>(null);

  const onSubmit = (e: React.FormEvent) => {
    handleSubmit(e);
    // Keep focus on input after submission
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  // Auto-focus on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <form onSubmit={onSubmit} className="w-full max-w-xl mx-auto">
      <div className="flex gap-2 p-4">
        <Input
          ref={inputRef}
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