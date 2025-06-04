export type Message =
  | { success: string }
  | { error: string }
  | { message: string };

export type FormMessageProps = {
  variant?: "success" | "error" | "info"
  children?: React.ReactNode
  message?: Message
}

export function FormMessage({ 
  variant = "info", 
  children 
}: FormMessageProps) {
  // If direct children are provided
  if (children) {
    return (
      <div className="flex flex-col gap-2 w-full text-sm">
        {variant === "success" && (
          <div className="text-green-600 border-l-2 border-green-600 px-4">
            {children}
          </div>
        )}
        {variant === "error" && (
          <div className="text-destructive border-l-2 border-destructive px-4">
            {children}
          </div>
        )}
        {variant === "info" && (
          <div className="text-foreground border-l-2 border-foreground px-4">
            {children}
          </div>
        )}
      </div>
    );
  }
  
  return null;
}
