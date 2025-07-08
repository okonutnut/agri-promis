"use client";

import { BellIcon } from "lucide-react";
import { Button } from "../ui/button";
import { SidebarTrigger } from "../ui/sidebar";

interface NavbarProps {
  pageTitle: string;
}
export default function Navbar({ pageTitle }: NavbarProps) {
  return (
    <nav className="flex justify-between items-center h-16 px-4 w-full">
      <div className="flex items-center gap-4">
        <SidebarTrigger />
        <h1 className="text-2xl font-bold text-primary uppercase">
          {pageTitle}
        </h1>
      </div>

      <Button className="h-10 w-10 p-0 relative rounded-full" variant="ghost">
        <BellIcon className="h-5 w-5" />
        <span className="sr-only">Notifications</span>
      </Button>
    </nav>
  );
}
