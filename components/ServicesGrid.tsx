'use client';

import { useState } from 'react';
import { ServiceCard } from "./ServiceCard";
import { Button } from "./ui/button";

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
  const [showAll, setShowAll] = useState(false);
  const displayedServices = showAll ? services : services.slice(0, 10);
  const hasMore = services.length > 10;

  return (
    <div className="w-full">
      {message && (
        <p className="text-sm text-foreground mb-4">{message}</p>
      )}
      <div className="flex flex-col gap-2">
        {displayedServices.map((item) => (
          <ServiceCard key={item.id} id={item.id} service={item.service} />
        ))}
      </div>
      {hasMore && !showAll && (
        <div className="mt-4 text-center">
          <Button 
            variant="outline" 
            onClick={() => setShowAll(true)}
            className="w-full sm:w-auto"
          >
            See all ({services.length - 10} more)
          </Button>
        </div>
      )}
      {hasMore && showAll && (
        <div className="mt-4 text-center">
          <Button 
            variant="outline" 
            onClick={() => setShowAll(false)}
            className="w-full sm:w-auto"
          >
            Show less
          </Button>
        </div>
      )}
    </div>
  );
}