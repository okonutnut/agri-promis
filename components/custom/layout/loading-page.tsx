import { Loader2 } from "lucide-react";

export default function LoadingPage() {
  return (
    <div className="flex items-center justify-center h-screen w-screen">
      <Loader2 className="animate-spin h-16 w-16 text-primary" />
    </div>
  );
}
