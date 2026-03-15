"use client";

import { Button } from "@/components/ui/button";

export default function OfflinePage() {
  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <section className="w-full max-w-md rounded-lg border bg-background p-6 text-center shadow-sm">
        <h1 className="text-2xl font-semibold text-foreground">You&apos;re offline</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          It looks like your internet connection is unavailable right now.
          Please check your connection and try again.
        </p>
        <Button className="mt-6 w-full" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </section>
    </main>
  );
}
