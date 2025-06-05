"use client"

import { Button } from "./ui/button";
import AuthButtonClient from "./auth/auth-button-client";
import { useEffect, useState } from "react";

export default function AuthButton() {
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const authToken = localStorage.getItem("authToken");
    const userEmail = localStorage.getItem("userEmail");
    
    if (authToken && userEmail) {
      setUser({ email: userEmail });
    }
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userEmail");
    setUser(null);
    window.location.reload();
  };

  if (!isClient) {
    return <AuthButtonClient />;
  }
  
  if (user) {
    return (
      <div className="flex items-center gap-4">
        {user.email}
        <Button type="button" variant={"outline"} onClick={handleSignOut}>
          Sign out
        </Button>
      </div>
    );
  } 
  
  return <AuthButtonClient />;
}