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
  { key: "Markets", value: "What markets are you in?" },
  { key: "Services", value: "What services do you offer?" },
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
    <div className="max-w-xl mx-auto mt-10">
      <Card className="border-0">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <AIAvatar />
          </div>
          <CardTitle className="font-bold text-4xl text-center">How can I help you today?</CardTitle>
          <CardDescription>Book and modify Glamsquad appointments in your market</CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground/90 leading-normal">         
          {/* Suggestion buttons */}
          <div className="flex flex-wrap gap-2 mt-4">
            {suggestions.map((suggestion, index) => (
              <Button 
                key={index} 
                variant="outline" 
                className="text-sm" 
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
