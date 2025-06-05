'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Phone, MapPin } from "lucide-react";

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
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          User Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-semibold text-lg">
            {user.nameFirst} {user.nameLast}
          </h3>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span>{user.email}</span>
          </div>
          
          {user.phone && (
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{user.phone}</span>
            </div>
          )}
        </div>

        {user.addresses && user.addresses.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-semibold flex items-center gap-2">
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
          <Badge variant="outline" className="mb-2">
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