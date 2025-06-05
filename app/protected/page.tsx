"use client"

import { InfoIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { redirect } from "next/navigation";

export default function ProtectedPage() {
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    const userEmail = localStorage.getItem("userEmail");
    
    if (!authToken || !userEmail) {
      window.location.href = "/";
      return;
    }
    
    setUser({ email: userEmail });
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-12">
      <div className="w-full">
        <div className="bg-accent text-sm p-3 px-5 rounded-md text-foreground flex gap-3 items-center">
          <InfoIcon size="16" strokeWidth={2} />
          This is a page that you can only see as an authenticated user
        </div>
      </div>
      <div className="flex flex-col gap-2 items-start">
        <h2 className="font-bold text-2xl mb-4">Hey {user.email}!</h2>
        <p className="text-sm text-foreground/70">You have successfully logged in.</p>
      </div>
    </div>
  );
}
