"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import LoginForm from "./login-form"

type AuthModalProps = {
  triggerElement?: React.ReactNode
  onClose?: () => void
}

export default function AuthModal({ triggerElement, onClose }: AuthModalProps) {
  const [open, setOpen] = useState(false)

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen && onClose) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {triggerElement ? (
        <DialogTrigger asChild>
          {triggerElement}
        </DialogTrigger>
      ) : (
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            Sign in
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Sign in</DialogTitle>
          <DialogDescription>
            Enter your credentials to sign in to your account.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          <LoginForm 
            onSuccess={() => {
              setOpen(false);
              onClose?.();
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}