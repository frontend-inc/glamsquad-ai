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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { CalendarIcon, MapPin, DollarSign, Clock, Loader2 } from "lucide-react";

interface AppointmentService {
  id: string;
  bookingToken: string;
  service: {
    name: string;
    price?: number;
    duration?: number;
    description?: string;
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
  const [showCancelDialog, setShowCancelDialog] = useState(false);

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

  const formatPrice = (price: number | undefined) => {
    if (price === undefined || isNaN(price)) return '$0';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const formatDuration = (minutes: number | undefined) => {
    if (!minutes) return '';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0 && mins > 0) return `${hours}h ${mins}m`;
    if (hours > 0) return `${hours}h`;
    return `${mins}m`;
  };

  const formatAddress = (address: AppointmentData['address']) => {
    const parts = [address.street];
    if (address.apartment) parts.push(`Apt ${address.apartment}`);
    parts.push(`${address.city}, ${address.state} ${address.zip}`);
    return parts.join(', ');
  };

  const calculateTotalPrice = () => {
    if (appointment.finalPrice !== undefined && !isNaN(appointment.finalPrice)) {
      return appointment.finalPrice;
    }
    if (appointment.totalPrice !== undefined && !isNaN(appointment.totalPrice)) {
      return appointment.totalPrice;
    }
    // Calculate from services if prices are available
    const servicesTotal = appointment.appointmentServices.reduce((total, service) => {
      return total + (service.service.price || 0);
    }, 0);
    return servicesTotal;
  };

  const handleCancelAppointment = async () => {
    setIsCancelling(true);
    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await fetch('/api/cancel-appointment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': accessToken ? `Bearer ${accessToken}` : '',
        },
        body: JSON.stringify({
          appointmentId: appointment.id,
          cancellationReason: 'Customer requested cancellation'
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to cancel appointment');
      }

      // Close both dialogs
      setShowCancelDialog(false);
      onClose();
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      // Could add error toast here
    } finally {
      setIsCancelling(false);
    }
  };

  const handleReschedule = () => {
    onClose();
    if (onSendMessage) {
      onSendMessage(`I'd like to reschedule my appointment on ${formatDateTime(appointment.startDateTime)}`);
    }
  };

  return (
    <>
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
            <div className="space-y-3">
              <p className="font-medium">Services</p>
              <div className="space-y-2">
                {appointment.appointmentServices.map((appointmentService) => (
                  <Card key={appointmentService.id} className="p-4">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <h3 className="font-medium text-lg mb-1">{appointmentService.service.name}</h3>
                        {appointmentService.service.description && (
                          <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                            {appointmentService.service.description}
                          </p>
                        )}
                        {appointmentService.service.duration && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <span>{formatDuration(appointmentService.service.duration)}</span>
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-semibold">
                          {formatPrice(appointmentService.service.price)}
                        </span>
                      </div>
                    </div>
                  </Card>
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
                {formatPrice(calculateTotalPrice())}
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
            <Button
              variant="outline"
              onClick={() => setShowCancelDialog(true)}
            >
              Cancel Appointment
            </Button>
            <Button onClick={handleReschedule}>
              Reschedule Appointment
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>

    <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Cancel Appointment</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to cancel your appointment on {formatDateTime(appointment.startDateTime)}? 
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isCancelling}>
            Keep Appointment
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleCancelAppointment}
            disabled={isCancelling}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isCancelling ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Cancelling...
              </>
            ) : (
              'Cancel Appointment'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    </>
  );
}