"use client";

import { Button } from "@/components/ui/button";

export default function ErrorPage() {
  return (
    <section className="w-screen h-screen flex justify-center items-center gap-6">
      <span className="text-2xl font-bold">
        Something went wrong. Please try again.
      </span>
      <Button
        variant={"outline"}
        onClick={() => {
          window.location.reload();
        }}
      >
        Reload
      </Button>
    </section>
  );
}
