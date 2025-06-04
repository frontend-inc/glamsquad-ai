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
  availability: { appointmentService: AvailabilitySlot } | any;
  message?: string;
}

export function AvailabilityGrid({ availability, message }: AvailabilityGridProps) {
  return (
    <div className="w-full">
      {message && (
        <p className="text-sm text-muted-foreground mb-4">{message}</p>
      )}
      {availability?.appointmentService && (
        <AvailabilityCard slot={availability.appointmentService} />
      )}
    </div>
  );
}