'use client';

import { Card } from "@/components/ui/card";
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
    <div className="fixed inset-x-0 bottom-10 w-full">
      <div className="w-full max-w-xl mx-auto">
        <Card className="p-2">
          <form onSubmit={handleSubmit}>
            <div className="flex">
              <Input
                type="text"
                value={input}
                onChange={handleInputChange}
                className="chat-input w-[95%] mr-2 border-0"
                placeholder='How can I help you today?'
              />
              <Button disabled={isDisabled}>
                <ArrowUpIcon className="h-4 w-4" />
              </Button>
            </div>              
          </form>
        </Card>
      </div>
    </div>
  );
}