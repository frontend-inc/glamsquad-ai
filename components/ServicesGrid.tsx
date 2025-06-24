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
    isAddOn?: boolean;
    serviceType?: {
      name: string;
    };
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
  onSendMessage?: (message: string) => void;
}

export function ServicesGrid({ services, message, onSendMessage }: ServicesGridProps) {
  const [showAll, setShowAll] = useState(false);
  
  // Filter out services where isAddOn is true or serviceType.name is 'Events' or 'Weddings'
  const filteredServices = services.filter(item => {
    const service = item.service;
    // Filter out add-on services
    if (service.isAddOn) return false;
    // Filter out Events and Weddings services
    if (service.serviceType?.name === 'Events') return false;
    if (service.serviceType?.name === 'Weddings') return false;
    return true;
  });
  
  const displayedServices = showAll ? filteredServices : filteredServices.slice(0, 3);
  const hasMore = filteredServices.length > 3;

  return (
    <div className="w-full">
      {message && (
        <p className="py-1 text-base text-foreground mb-4">{message}</p>
      )}
      <div className="flex flex-col gap-2">
        {displayedServices.map((item) => (
          <ServiceCard key={item.id} id={item.id} service={item.service} onSendMessage={onSendMessage} />
        ))}
      </div>
      {hasMore && !showAll && (
        <div className="mt-4 text-center">
          <Button 
            variant="outline" 
            onClick={() => setShowAll(true)}
            className="w-full sm:w-auto"
          >
            See all ({filteredServices.length - 10} more)
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