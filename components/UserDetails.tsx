'use client';

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";

interface Address {
  id: string;
  street: string;
  apartment?: string;
  city: string;
  state: string;
  zip: string;
  type?: string;
}

interface UserData {
  id: string;
  email: string;
  nameFirst: string;
  nameLast: string;
  phone?: string;
  addresses?: Address[];
}

interface UserDetailsProps {
  user: UserData;
}

export function UserDetails({ user }: UserDetailsProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <h2 className="text-xl font-semibold text-secondary font-playfair">
          {user.nameFirst} {user.nameLast}
        </h2>
      </CardHeader>
      <CardContent className="space-y-4">

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