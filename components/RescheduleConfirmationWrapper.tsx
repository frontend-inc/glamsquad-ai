'use client';

import { useState } from 'react';
import { RescheduleConfirmationCard } from './RescheduleConfirmationCard';
import { Card } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

interface RescheduleConfirmationWrapperProps {
  rescheduleParams: any;
  address?: any;
  onSendMessage?: (message: string) => void;
  message: string;
}

export function RescheduleConfirmationWrapper({ rescheduleParams, address, onSendMessage, message }: RescheduleConfirmationWrapperProps) {
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState('');
  
  const handleConfirmReschedule = (message: string) => {
    setIsConfirmed(true);
    setConfirmationMessage(message);
  };

  const handleCancelReschedule = () => {
    if (onSendMessage) {
      onSendMessage("I've cancelled the reschedule. Would you like to try a different time?");
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
            <h3 className="font-medium text-lg text-green-800">Appointment Rescheduled!</h3>
          </div>
          <p className="text-sm text-green-700">{confirmationMessage}</p>
        </Card>
      )}
      {!isConfirmed && (
        <RescheduleConfirmationCard
          rescheduleParams={rescheduleParams}
          address={address}
          onConfirm={handleConfirmReschedule}
          onCancel={handleCancelReschedule}
          isConfirmed={isConfirmed}
        />
      )}
    </div>
  );
}