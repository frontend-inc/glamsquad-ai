import { InfoIcon } from "lucide-react";

export function AIAvailabilityWarning() {
  return (
    <div className="max-w-xl mx-auto mt-4 mb-4 flex flex-col items-center">
      <div className="flex flex-row space-x-2 items-center p-2 rounded-lg bg-blue-400/10">
        <InfoIcon className="text-blue-400 h-4 w-4" />
        <p className="text-blue-500 text-sm">
          OpenAI API key not configured - chat will display a placeholder
        </p>
      </div>
      <p className="text-sm text-muted-foreground mt-2">
        To enable real chat functionality, install OpenAI from your Frontend project settings.
      </p>
    </div>
  );
}