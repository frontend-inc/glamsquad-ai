import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDate, formatAddress } from "@/lib/utils";
import { Clock, DollarSign, Loader2 } from "lucide-react";

interface Service {
  id: string;
  name: string;
  price: number;
  duration: number;
}

interface BookingConfirmationCardProps {
  bookingParams: {
    startDateTime: string;
    bookingTokens: string[];
    addressId: string;
    userId: string;
    services: Service[];
    addOnServices?: Service[];
    totalPrice: number;
  };
  onConfirm?: () => void;
  onCancel?: () => void;
  isLoading?: boolean;
  isConfirmed?: boolean;
}

export function BookingConfirmationCard({ bookingParams, onConfirm, onCancel, isLoading = false, isConfirmed = false }: BookingConfirmationCardProps) {
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

  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`;
  };

  return (
    <Card className="p-4 space-y-4">
      <div className="space-y-4">
        <h3 className="font-medium text-lg text-secondary">Confirm Your Booking</h3>
        
        {/* Date and Time */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{formatDate(bookingParams.startDateTime)} at {formatTime(bookingParams.startDateTime)}</span>
          </div>
        </div>

        {/* Services */}
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Services</h4>
          <div className="space-y-1">
            {bookingParams.services.map((service) => (
              <div key={service.id} className="flex justify-between text-sm">
                <span>{service.name}</span>
                <span>{formatPrice(service.price)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Add-ons */}
        {bookingParams.addOnServices && bookingParams.addOnServices.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Add-ons</h4>
            <div className="space-y-1">
              {bookingParams.addOnServices.map((addon) => (
                <div key={addon.id} className="flex justify-between text-sm">
                  <span>{addon.name}</span>
                  <span>{formatPrice(addon.price)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Total Price */}
        <div className="flex justify-between items-center pt-2 border-t">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">Total</span>
          </div>
          <span className="font-semibold">{formatPrice(bookingParams.totalPrice)}</span>
        </div>
      </div>
      
      {!isConfirmed && (
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button 
            className="flex-1"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Confirming...
              </>
            ) : (
              'Confirm Booking'
            )}
          </Button>
        </div>
      )}
    </Card>
  );
} 