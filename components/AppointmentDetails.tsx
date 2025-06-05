'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, MapPin, DollarSign, CheckCircle } from "lucide-react";

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
    city: string;
    state: string;
  };
  appointmentServices: AppointmentService[];
}

interface AppointmentDetailsProps {
  appointment: AppointmentData;
}

export function AppointmentDetails({ appointment }: AppointmentDetailsProps) {
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

  return (
    <Card className="hover:shadow-md transition-shadow">
      <div className="p-4">
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <h3 className="font-medium text-lg text-secondary font-playfair">Appointment Confirmed</h3>
            </div>
            
            <div className="space-y-1 mb-2">
              <p className="text-sm text-muted-foreground">
                {formatDateTime(appointment.startDateTime)}
              </p>
              <p className="text-sm text-muted-foreground">
                {appointment.address.street}, {appointment.address.city}, {appointment.address.state}
              </p>
            </div>

            {appointment.appointmentServices.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-2">
                {appointment.appointmentServices.map((service) => (
                  <Badge key={service.id} variant="secondary" className="text-xs">
                    {service.service.name}
                  </Badge>
                ))}
              </div>
            )}

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CalendarIcon className="h-4 w-4" />
              <span>ID: {appointment.id.substring(0, 8)}</span>
            </div>
          </div>
          
          <div className="text-right">
            <span className="text-lg font-semibold">
              {formatPrice(appointment.finalPrice || appointment.totalPrice)}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}