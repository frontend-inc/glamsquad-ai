'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface AIAvatarProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function AIAvatar({ size = 'lg', className }: AIAvatarProps) {
  const sizeClasses = {
    sm: 'h-10 w-10',
    md: 'h-16 w-16', 
    lg: 'h-24 w-24'
  };

  return (
    <Avatar className={cn("mx-auto", sizeClasses[size], size === 'lg' && 'mb-2', className)}>
      <AvatarImage 
        className="aspect-square object-cover"
        src="/avatar.webp" alt="AI" />
      <AvatarFallback className="bg-primary text-primary-foreground text-xs">AI</AvatarFallback>
    </Avatar>
  );
}