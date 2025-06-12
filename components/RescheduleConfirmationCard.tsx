'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatDate, formatAddress } from '@/lib/utils';
import { Clock, DollarSign, Loader2, MapPin } from 'lucide-react';

interface Service {
  id: string;
  name: string;
  price: number;
  duration: number;
}

interface RescheduleParams {
  appointmentId: string;
  startDateTime: string;
  bookingTokens: string[];
  addressId: string;
  services?: Service[];
  totalPrice?: number;
}

interface RescheduleConfirmationCardProps {
  rescheduleParams: RescheduleParams;
  address?: {
    street: string;
    apartment?: string;
    city: string;
    state: string;
    zip: string;
  };
  onConfirm?: (message: string) => void;
  onCancel?: () => void;
  isLoading?: boolean;
  isConfirmed?: boolean;
}

export function RescheduleConfirmationCard({ rescheduleParams, address, onConfirm, onCancel, isLoading = false, isConfirmed = false }: RescheduleConfirmationCardProps) {
  const [isRescheduling, setIsRescheduling] = useState(false);

  const formatTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0 && mins > 0) return `${hours}h ${mins}m`;
    if (hours > 0) return `${hours}h`;
    return `${mins}m`;
  };

  const formatPrice = (price: number | undefined) => {
    if (price === undefined || isNaN(price)) return '$0.00';
    return `$${price.toFixed(2)}`;
  };

  const handleConfirmReschedule = async () => {
    setIsRescheduling(true);
    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await fetch('/api/reschedule-appointment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': accessToken ? `Bearer ${accessToken}` : '',
        },
        body: JSON.stringify({
          appointmentId: rescheduleParams.appointmentId,
          startDateTime: rescheduleParams.startDateTime,
          bookingTokens: rescheduleParams.bookingTokens,
          addressId: rescheduleParams.addressId
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to reschedule appointment');
      }

      if (onConfirm) {
        onConfirm(`Your appointment has been successfully rescheduled to ${formatDate(rescheduleParams.startDateTime)} at ${formatTime(rescheduleParams.startDateTime)}.`);
      }
    } catch (error) {
      console.error('Error rescheduling appointment:', error);
      if (onConfirm) {
        onConfirm('There was an error rescheduling your appointment. Please try again later.');
      }
    } finally {
      setIsRescheduling(false);
    }
  };

  return (
    <Card className="p-4 space-y-4">
      <div className="space-y-4">
        <h3 className="font-medium text-lg text-secondary">Confirm Your Rescheduled Appointment</h3>
        
        {/* Date and Time */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{formatDate(rescheduleParams.startDateTime)} at {formatTime(rescheduleParams.startDateTime)}</span>
          </div>
        </div>

        {/* Location */}
        {address && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{formatAddress(address)}</span>
            </div>
          </div>
        )}

        {/* Services */}
        {rescheduleParams.services && rescheduleParams.services.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Services</h4>
            <div className="space-y-1">
              {rescheduleParams.services.map((service) => (
                <div key={service.id} className="flex justify-between text-sm">
                  <span>{service.name}</span>
                  <span>{formatPrice(service.price)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Total Price */}
        {rescheduleParams.totalPrice !== undefined && (
          <div className="flex justify-between items-center pt-2 border-t">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Total</span>
            </div>
            <span className="font-semibold">{formatPrice(rescheduleParams.totalPrice)}</span>
          </div>
        )}
      </div>
      
      {!isConfirmed && (
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={onCancel}
            disabled={isRescheduling || isLoading}
          >
            Cancel
          </Button>
          <Button 
            className="flex-1"
            onClick={handleConfirmReschedule}
            disabled={isRescheduling || isLoading}
          >
            {isRescheduling || isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Rescheduling...
              </>
            ) : (
              'Confirm Reschedule'
            )}
          </Button>
        </div>
      )}
    </Card>
  );
}