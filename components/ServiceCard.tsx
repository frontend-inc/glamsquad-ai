'use client';

import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Clock } from "lucide-react";
import { ServiceModal } from "./ServiceModal";

interface AddOnService {
  id: string;
  name: string;
  price: number;
  duration: number;
}

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  addOnServices: AddOnService[];
}

interface ServiceCardProps {
  id: string;
  service: Service;
}

export function ServiceCard({ service }: ServiceCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const formatPrice = (price: number) => {
    return price === 0 ? "Free" : `$${price}`;
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0 && mins > 0) return `${hours}h ${mins}m`;
    if (hours > 0) return `${hours}h`;
    return `${mins}m`;
  };

  return (
    <>
      <Card 
        className="hover:shadow-md transition-shadow cursor-pointer"
        onClick={() => setIsModalOpen(true)}
      >
        <div className="p-4">
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1">
              <h3 className="font-medium text-lg text-secondary mb-1 font-playfair">{service.name}</h3>
              {service.description && (
                <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{service.description}</p>
              )}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{formatDuration(service.duration)}</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-lg font-semibold">{formatPrice(service.price)}</span>
            </div>
          </div>
        </div>
      </Card>

      <ServiceModal
        service={service}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}