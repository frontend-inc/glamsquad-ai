'use client';

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
  const formatPrice = (price: number) => {
    return price === 0 ? "Free" : `$${price}`;
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="font-medium text-base">{service.name}</h3>
            {service.addOnServices.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {service.addOnServices.map((addon) => (
                  <Badge key={addon.id} variant="secondary" className="text-xs">
                    {addon.name} • {formatPrice(addon.price)}
                  </Badge>
                ))}
              </div>
            )}
          </div>
          <div className="ml-4">
            <span className="text-lg font-semibold">{formatPrice(service.price)}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}