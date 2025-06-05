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
    }).format(price / 100);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-secondary">
          <CheckCircle className="h-5 w-5 text-green-600" />
          Appointment Confirmed
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          <div>
            <p className="font-semibold text-secondary">Date & Time</p>
            <p className="text-sm text-muted-foreground">{formatDateTime(appointment.startDateTime)}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <div>
            <p className="font-semibold text-secondary">Location</p>
            <p className="text-sm text-muted-foreground">
              {appointment.address.street}
            </p>
            <p className="text-sm text-muted-foreground">
              {appointment.address.city}, {appointment.address.state}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-muted-foreground" />
          <div>
            <p className="font-semibold text-secondary">Total</p>
            <p className="text-sm text-muted-foreground">
              {formatPrice(appointment.finalPrice || appointment.totalPrice)}
            </p>
          </div>
        </div>

        {appointment.appointmentServices.length > 0 && (
          <div>
            <p className="font-semibold mb-2 text-secondary">Services</p>
            <div className="space-y-2">
              {appointment.appointmentServices.map((service) => (
                <Badge key={service.id} variant="secondary" className="mr-2">
                  {service.service.name}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className="pt-2 border-t">
          <p className="text-xs text-muted-foreground">
            Appointment ID: {appointment.id}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}