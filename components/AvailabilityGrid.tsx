'use client';

import { AvailabilityCard } from "./AvailabilityCard";

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

interface AvailabilityGridProps {
  availability: AvailabilitySlot[] | any;
  message?: string;
}

export function AvailabilityGrid({ availability, message }: AvailabilityGridProps) {
  // Handle both array and legacy single object formats
  const slots = Array.isArray(availability) ? availability : 
    (availability?.appointmentService ? [availability.appointmentService] : []);

  return (
    <div className="w-full">
      {message && (
        <p className="text-base text-foreground mb-4">{message}</p>
      )}
      <div className="flex flex-col gap-2">
        {slots.map((slot, index) => (
          <AvailabilityCard key={slot.id || index} slot={slot} />
        ))}
      </div>
      {slots.length === 0 && (
        <p className="text-sm text-muted-foreground">No availability found.</p>
      )}
    </div>
  );
}