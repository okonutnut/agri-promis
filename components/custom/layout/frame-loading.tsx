"use client";

import { Loader2 } from "lucide-react";

export default function FrameLoading() {
  return (
    <section className="w-full h-screen flex flex-col relative text-sm overflow-hidden">
      <div className="flex flex-col flex-1 justify-center items-center h-full w-full">
        <div className="loader"></div>
      </div>
    </section>
  );
}
