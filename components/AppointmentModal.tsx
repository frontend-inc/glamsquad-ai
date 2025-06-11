'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, MapPin, DollarSign, Clock, Loader2 } from "lucide-react";

interface AppointmentService {
  id: string;
  bookingToken: string;
  service: {
    name: string;
  };
}

interface AppointmentData {
  id: string;
  startDateTime: string;
  totalPrice: number;
  finalPrice: number;
  bookingTokens: string[];
  address: {
    street: string;
    apartment?: string;
    city: string;
    state: string;
    zip: string;
  };
  appointmentServices: AppointmentService[];
  isCanceled?: boolean;
  cancellationReason?: string;
}

interface AppointmentModalProps {
  appointment: AppointmentData;
  isOpen: boolean;
  onClose: () => void;
  onSendMessage?: (message: string) => void;
}

export function AppointmentModal({ appointment, isOpen, onClose, onSendMessage }: AppointmentModalProps) {
  const [isCancelling, setIsCancelling] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [cancellationReason, setCancellationReason] = useState('');

  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime);
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
      timeZone: 'America/New_York'
    }).format(date);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const formatAddress = (address: AppointmentData['address']) => {
    const parts = [address.street];
    if (address.apartment) parts.push(`Apt ${address.apartment}`);
    parts.push(`${address.city}, ${address.state} ${address.zip}`);
    return parts.join(', ');
  };

  const handleCancelAppointment = async () => {
    setIsCancelling(true);
    try {
      const response = await fetch('/api/cancel-appointment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          appointmentId: appointment.id,
          cancellationReason: cancellationReason || 'Customer requested cancellation'
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to cancel appointment');
      }

      // Close modal and send confirmation message
      onClose();
      if (onSendMessage) {
        onSendMessage(`Your appointment on ${formatDateTime(appointment.startDateTime)} has been cancelled.`);
      }
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      // Could add error toast here
    } finally {
      setIsCancelling(false);
      setShowCancelConfirm(false);
    }
  };

  const handleReschedule = () => {
    onClose();
    if (onSendMessage) {
      onSendMessage(`I'd like to reschedule my appointment on ${formatDateTime(appointment.startDateTime)}`);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Appointment Details</DialogTitle>
          <DialogDescription>
            {appointment.isCanceled ? 'This appointment has been cancelled' : 'View and manage your appointment'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Date and Time */}
          <div className="flex items-center gap-3">
            <CalendarIcon className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="font-medium">Date & Time</p>
              <p className="text-sm text-muted-foreground">{formatDateTime(appointment.startDateTime)}</p>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center gap-3">
            <MapPin className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="font-medium">Location</p>
              <p className="text-sm text-muted-foreground">{formatAddress(appointment.address)}</p>
            </div>
          </div>

          {/* Services */}
          {appointment.appointmentServices.length > 0 && (
            <div>
              <p className="font-medium mb-2">Services</p>
              <div className="flex flex-wrap gap-2">
                {appointment.appointmentServices.map((service) => (
                  <Badge key={service.id} variant="secondary">
                    {service.service.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center gap-3">
            <DollarSign className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="font-medium">Total Price</p>
              <p className="text-sm text-muted-foreground">
                {formatPrice(appointment.finalPrice || appointment.totalPrice)}
              </p>
            </div>
          </div>

          {/* Cancellation Status */}
          {appointment.isCanceled && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm font-medium text-red-800">Appointment Cancelled</p>
              {appointment.cancellationReason && (
                <p className="text-sm text-red-600 mt-1">Reason: {appointment.cancellationReason}</p>
              )}
            </div>
          )}
        </div>

        {!appointment.isCanceled && (
          <DialogFooter className="gap-2 sm:gap-0">
            {showCancelConfirm ? (
              <>
                <Button
                  variant="outline"
                  onClick={() => setShowCancelConfirm(false)}
                  disabled={isCancelling}
                >
                  Keep Appointment
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleCancelAppointment}
                  disabled={isCancelling}
                >
                  {isCancelling ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Cancelling...
                    </>
                  ) : (
                    'Confirm Cancellation'
                  )}
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={() => setShowCancelConfirm(true)}
                >
                  Cancel Appointment
                </Button>
                <Button onClick={handleReschedule}>
                  Reschedule Appointment
                </Button>
              </>
            )}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}