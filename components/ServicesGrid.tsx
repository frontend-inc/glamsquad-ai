'use client';

import { ServiceCard } from "./ServiceCard";

interface ServiceItem {
  id: string;
  service: {
    id: string;
    name: string;
    description: string;
    price: number;
    duration: number;
    addOnServices: Array<{
      id: string;
      name: string;
      price: number;
      duration: number;
    }>;
  };
}

interface ServicesGridProps {
  services: ServiceItem[];
  message?: string;
}

export function ServicesGrid({ services, message }: ServicesGridProps) {
  return (
    <div className="w-full">
      {message && (
        <p className="text-sm text-muted-foreground mb-4">{message}</p>
      )}
      <div className="flex flex-col gap-2">
        {services.map((item) => (
          <ServiceCard key={item.id} id={item.id} service={item.service} />
        ))}
      </div>
    </div>
  );
}