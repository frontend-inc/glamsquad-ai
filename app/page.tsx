import Chat from "@/components/chat";
import { checkAIAvailability } from "../utils/ai";
import { AIAvailabilityWarning } from "@/components/ai-availability-warning";

export default async function Home() {
  const isAIAvailable = await checkAIAvailability();

  return (
    <div className="flex flex-col w-full">
      <div className="w-full flex-1 flex flex-col min-h-[80vh] relative">
        {!isAIAvailable && <AIAvailabilityWarning />}
        <Chat />
      </div>
    </div>
  );
}
