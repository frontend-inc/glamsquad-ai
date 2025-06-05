'use client';

import { Card } from "@/components/ui/card";
import { Clock, User } from "lucide-react";

interface AvailabilitySlot {
  id: string;
  startDateTime: string;
  timezone: string;
  duration: number;
  customDuration?: number;
  price: number;
  customPrice?: number;
  providerName: string;
  providerPhotoUrl?: string;
  providerMatchScore?: number;
  isSquadSearch: boolean;
  isMember: boolean;
  bookingToken: string;
}

interface AvailabilityCardProps {
  slot: AvailabilitySlot;
}

export function AvailabilityCard({ slot }: AvailabilityCardProps) {
  const formatTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDuration = (minutes: number) => {
    const actualDuration = slot.customDuration || minutes;
    const hours = Math.floor(actualDuration / 60);
    const mins = actualDuration % 60;
    if (hours > 0 && mins > 0) return `${hours}h ${mins}m`;
    if (hours > 0) return `${hours}h`;
    return `${mins}m`;
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium text-secondary">{formatTime(slot.startDateTime)}</span>
            </div>
            <div className="text-sm text-muted-foreground">
              {formatDuration(slot.duration)}
            </div>
          </div>
          {slot.providerName && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="w-4 h-4" />
              <span>{slot.providerName}</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}