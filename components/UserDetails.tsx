'use client';

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, CalendarIcon, Clock } from "lucide-react";

interface Address {
  id: string;
  street: string;
  apartment?: string;
  city: string;
  state: string;
  zip: string;
  type?: string;
}

interface Appointment {
  id: string;
  startDateTime: string;
  endDateTime: string;
  isCanceled?: boolean;
  appointmentServices: Array<{
    service: {
      id: string;
      name: string;
      price: number;
    };
  }>;
}

interface UserData {
  id: string;
  email: string;
  nameFirst: string;
  nameLast: string;
  phone?: string;
  addresses?: Address[];
  appointments?: Appointment[];
}

interface UserDetailsProps {
  user: UserData;
}

export function UserDetails({ user }: UserDetailsProps) {
  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime);
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
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

  // Filter upcoming appointments only
  const upcomingAppointments = user.appointments?.filter(appointment => {
    const appointmentDate = new Date(appointment.startDateTime);
    const now = new Date();
    return appointmentDate > now;
  }) || [];

  return (
    <Card className="w-full md:min-w-[300px]">
      <CardHeader>
        <h2 className="text-xl font-semibold text-secondary font-playfair">
          {user.nameFirst} {user.nameLast}
        </h2>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Upcoming Appointments */}
        {upcomingAppointments.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-semibold flex items-center gap-2 text-secondary font-playfair">
              <CalendarIcon className="h-4 w-4" />
              Upcoming Appointments
            </h4>
            <div className="grid gap-3">
              {upcomingAppointments.map((appointment) => (
                <AppointmentCard key={appointment.id} appointment={appointment} />
              ))}
            </div>
          </div>
        )}

        {user.addresses && user.addresses.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-semibold flex items-center gap-2 text-secondary font-playfair">
              <MapPin className="h-4 w-4" />
              Addresses
            </h4>
            <div className="grid gap-3">
              {user.addresses.map((address) => (
                <AddressCard key={address.id} address={address} />
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function AppointmentCard({ appointment }: { appointment: Appointment }) {
  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime);
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
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

  const totalPrice = appointment.appointmentServices.reduce((total, service) => {
    return total + service.service.price;
  }, 0);

  return (
    <Card className="p-3">
      <div className="space-y-2">
        {appointment.isCanceled && (
          <Badge variant="destructive" className="text-xs w-fit">
            Canceled
          </Badge>
        )}
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm font-medium">
                {formatDateTime(appointment.startDateTime)}
              </p>
            </div>
            <div className="flex flex-wrap gap-1">
              {appointment.appointmentServices.map((service, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {service.service.name}
                </Badge>
              ))}
            </div>
          </div>
          <div className="text-right">
            <span className="text-sm font-semibold">
              {formatPrice(totalPrice)}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}

function AddressCard({ address }: { address: Address }) {
  return (
    <Card className="p-3">
      <div className="space-y-1">
        {address.type && (
          <Badge variant="secondary" className="mb-2">
            {address.type}
          </Badge>
        )}
        <p className="text-sm">
          {address.street}
          {address.apartment && `, ${address.apartment}`}
        </p>
        <p className="text-sm text-muted-foreground">
          {address.city}, {address.state} {address.zip}
        </p>
      </div>
    </Card>
  );
}