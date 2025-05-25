
import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex flex-1 h-full items-center justify-center bg-background">
      <Loader2 className="h-10 w-10 animate-spin text-primary" />
    </div>
  );
}
