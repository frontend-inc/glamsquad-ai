'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function AIAvatar() {
  return (
    <Avatar className="mx-auto mb-2">
      <AvatarImage 
        className="aspect-square object-cover"
        src="https://pviclbpvgkycfpsgllnd.supabase.co/storage/v1/object/public/media/raye.png" alt="AI" />
      <AvatarFallback className="bg-primary text-primary-foreground">AI</AvatarFallback>
    </Avatar>
  );
}