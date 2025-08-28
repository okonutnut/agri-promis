"use client";

import { Loader2 } from "lucide-react";
import CustomNavbar from "../navbar/custom-navbar";

export default function FrameLoading() {
  return (
    <section className="w-full h-screen flex flex-col relative text-sm overflow-hidden">
      <CustomNavbar navItems={[]} pageTitle={"..."} role={"admin"} />
      <div className="flex flex-col flex-1 justify-center items-center h-full w-full">
        <Loader2 className="text-primary animate-spin h-12 w-12" />
        <span>Loading please wait...</span>
      </div>
    </section>
  );
}
