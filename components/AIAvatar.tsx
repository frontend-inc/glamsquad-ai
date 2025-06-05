'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function AIAvatar() {
  return (
    <Avatar className="mx-auto h-24 w-24 mb-2">
      <AvatarImage 
        className="aspect-square object-cover"
        src="/avatar.webp" alt="AI" />
      <AvatarFallback className="bg-primary text-primary-foreground">AI</AvatarFallback>
    </Avatar>
  );
}