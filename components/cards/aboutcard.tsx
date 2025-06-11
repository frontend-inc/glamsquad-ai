import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AIAvatar } from "@/components/AIAvatar";

// Suggestion array with key-value pairs
const suggestions = [
  { key: "Book Makeup", value: "Book Makeup" },
  { key: "Book Hair", value: "Book Hair" },
  { key: "Book Nails", value: "Book Nails" },
  { key: "Update Appointment", value: "Update Appointment" },
];

interface AboutCardProps {
  setInput?: (text: string) => void;
}

export default function AboutCard({ setInput }: AboutCardProps) {
  // Function to handle suggestion click
  const handleSuggestionClick = (value: string) => {
    if (setInput) {
      setInput(value);
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      <Card className="border-0">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <AIAvatar />
          </div>
          <CardTitle className="font-bold text-3xl text-center text-secondary font-playfair">How can I help you today?</CardTitle>
          <CardDescription className='text-center'>Ask questions, book a service, or update your appointment with our Glamsquad AI.</CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground/90 leading-normal">         
          {/* Suggestion buttons */}
          <div className="flex flex-wrap gap-2 mt-4">
            {suggestions.map((suggestion, index) => (
              <Button 
                key={index} 
                variant="outline" 
                className="text-sm w-full md:w-auto" 
                onClick={() => handleSuggestionClick(suggestion.value)}
              >
                {suggestion.key}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
