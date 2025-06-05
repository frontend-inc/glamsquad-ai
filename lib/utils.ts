import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  const appointmentDate = typeof date === 'string' ? new Date(date) : date;
  
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'America/New_York', // Ensure the date is in EST timezone
  };
  
  return appointmentDate.toLocaleString('en-US', options);
}

interface Address {
  street: string;
  apartment?: string;
  city: string;
  state: string;
  zip: string;
}

export function formatAddress(address: Address): string {
  return [
    address.street,
    address.apartment ? `Apt ${address.apartment}` : null,
    address.city,
    address.state,
    address.zip
  ].filter(Boolean) // Filter out any null values
    .join(', ');
}
