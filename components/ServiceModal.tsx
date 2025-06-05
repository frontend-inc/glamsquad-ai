'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Clock, Minus, Plus } from "lucide-react";

interface AddOnService {
  id: string;
  name: string;
  price: number;
  duration: number;
  description?: string;
}

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  isAddOn?: boolean;
  addOnServices: AddOnService[];
  serviceType?: {
    name: string;
  };
}

interface ServiceModalProps {
  service: Service | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ServiceModal({ service, isOpen, onClose }: ServiceModalProps) {
  const [clientCount, setClientCount] = useState(1);
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);

  if (!service) return null;

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

  const toggleAddOn = (addOnId: string) => {
    setSelectedAddOns(prev => 
      prev.includes(addOnId) 
        ? prev.filter(id => id !== addOnId)
        : [...prev, addOnId]
    );
  };

  const calculateTotal = () => {
    const basePrice = service.price * clientCount;
    const addOnPrice = selectedAddOns.reduce((total, addOnId) => {
      const addOn = service.addOnServices.find(a => a.id === addOnId);
      return total + (addOn ? addOn.price * clientCount : 0);
    }, 0);
    return basePrice + addOnPrice;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          {service.serviceType && (
            <Badge variant="secondary" className="w-fit mb-2">
              {service.serviceType.name}
            </Badge>
          )}
          <DialogTitle className="text-2xl font-playfair text-secondary">
            {service.name}
          </DialogTitle>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{formatDuration(service.duration)}</span>
          </div>
          <div className="text-2xl font-semibold">
            {formatPrice(service.price)}
          </div>
        </DialogHeader>

        <div className="space-y-6">
          <p className="text-sm text-muted-foreground">
            {service.description}
          </p>

          {/* Client Count */}
          <div>
            <label className="text-sm font-medium">How many clients?</label>
            <div className="flex items-center gap-3 mt-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => setClientCount(Math.max(1, clientCount - 1))}
                disabled={clientCount <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="min-w-[2rem] text-center">{clientCount}</span>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => setClientCount(clientCount + 1)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Add Service Button */}
          <Button className="w-full" size="lg">
            Add Service
          </Button>

          {/* Add-ons Section */}
          {service.addOnServices.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-3">
                POPULAR ADD-ONS
              </h3>
              <div className="space-y-3">
                {service.addOnServices.map((addOn) => (
                  <div key={addOn.id} className="space-y-2">
                    <div className="flex items-center gap-3">
                      <Button
                        variant={selectedAddOns.includes(addOn.id) ? "default" : "outline"}
                        size="icon"
                        className="h-8 w-8 rounded-full flex-shrink-0"
                        onClick={() => toggleAddOn(addOn.id)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium font-playfair text-secondary">
                            {addOn.name}
                          </h4>
                          <span className="font-semibold">
                            {formatPrice(addOn.price)}
                          </span>
                        </div>
                        {addOn.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {addOn.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Details Section */}
          <div>
            <h3 className="font-medium font-playfair text-secondary mb-4">Details</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">What to expect:</h4>
                <p className="text-sm text-muted-foreground">
                  After a personalized consultation, your stylist will create your desired look using the latest tools and luxe products.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">How to prepare:</h4>
                <p className="text-sm text-muted-foreground">
                  Shampoo 10-15 minutes before your appointment. Hair should be clean and damp (but not soaking wet) when your stylist arrives. Please have a place for your stylist to set up near an electrical outlet so they can plug in the necessary hot tools.
                </p>
              </div>
            </div>
          </div>

          {/* Total if add-ons are selected */}
          {selectedAddOns.length > 0 && (
            <div className="border-t pt-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">Total:</span>
                <span className="text-xl font-semibold">
                  {formatPrice(calculateTotal())}
                </span>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}