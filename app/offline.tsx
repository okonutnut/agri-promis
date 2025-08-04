"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function NotFoundPage() {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen space-y-4 text-center">
      <h1 className="text-4xl font-bold">You are offline.</h1>
      <p className="mt-4">Please check your internet connection.</p>
      <Button variant={"outline"} size={"sm"} onClick={() => router.refresh()}>
        Refresh
      </Button>
    </div>
  );
}
