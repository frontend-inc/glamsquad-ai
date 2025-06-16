"use client"

import { Button } from "@/components/ui/button"
import { FormMessage } from "@/components/form-message"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { LoaderIcon } from "lucide-react"

type LoginFormProps = {
  onSuccess?: () => void
}

export default function LoginForm({ onSuccess }: LoginFormProps) {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: email,
          password: password,
        }),
      })

      if (response.ok) {
        const data = await response.json()

        // Store the token in localStorage
        localStorage.setItem("accessToken", data.access_token)
        localStorage.setItem("userEmail", email)
        
        setSuccess("You have been logged in successfully.")
        
        if (onSuccess) {
          onSuccess()
        }
        // Refresh the page to update the auth state
        window.location.reload()
      } else {
        const errorData = await response.json()
        setError(errorData.error || errorData.message || "Invalid email or password.")
      }
    } catch (error) {
      setError("Failed to connect to the server. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input 
          name="email" 
          id="email" 
          type="email"
          placeholder="you@example.com" 
          required 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input 
          name="password" 
          id="password" 
          type="password"
          placeholder="••••••••" 
          required 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      {error && <FormMessage variant="error">{error}</FormMessage>}
      {success && <FormMessage variant="success">{success}</FormMessage>}

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />
            Signing in...
          </>
        ) : (
          "Sign In"
        )}
      </Button>
    </form>
  )
}