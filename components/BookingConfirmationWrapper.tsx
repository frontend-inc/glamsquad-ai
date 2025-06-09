'use client';

import { useState } from 'react';
import { BookingConfirmationCard } from './BookingConfirmationCard';
import { Card } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

interface BookingConfirmationWrapperProps {
  bookingParams: any;
  onSendMessage?: (message: string) => void;
  message: string;
}

export function BookingConfirmationWrapper({ bookingParams, onSendMessage, message }: BookingConfirmationWrapperProps) {
  const [isConfirming, setIsConfirming] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState('');
  
  const handleConfirmBooking = async () => {
    setIsConfirming(true);
    try {
      const response = await fetch('/api/confirm-booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingParams),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to confirm booking');
      }

      // Update the card to show confirmation instead of sending message
      setIsConfirmed(true);
      setConfirmationMessage(data.message);
    } catch (error) {
      console.error('Error confirming booking:', error);
      // Don't add text to message input on error
    } finally {
      setIsConfirming(false);
    }
  };

  const handleCancelBooking = () => {
    if (onSendMessage) {
      onSendMessage("I've cancelled the booking. Would you like to try a different time?");
    }
  };

  return (
    <div className="space-y-4">
      <div className="max-w-none">
        {message}
      </div>
      {isConfirmed && (
        <Card className="p-4 space-y-3 border-green-200 bg-green-50">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <h3 className="font-medium text-lg text-green-800">Booking Confirmed!</h3>
          </div>
          <p className="text-sm text-green-700">{confirmationMessage}</p>
        </Card>
      )}
      <BookingConfirmationCard
        bookingParams={bookingParams}
        onConfirm={handleConfirmBooking}
        onCancel={handleCancelBooking}
        isLoading={isConfirming}
        isConfirmed={isConfirmed}
      />
    </div>
  );
}