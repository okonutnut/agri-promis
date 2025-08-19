"use client";

import { Loader2 } from "lucide-react";

export default function LoadingPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen bg-opacity-50 space-y-4">
      <Loader2 className="animate-spin h-16 w-16 text-primary" />
    </div>
  );
}
