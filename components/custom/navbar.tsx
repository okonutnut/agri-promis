"use client";

import NavbarUserImage from "./navbar-user-image";
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
      <Button
        variant="ghost"
        className="h-10 w-10 p-0 rounded-full cursor-pointer"
        onClick={() => alert()}
      >
        <NavbarUserImage />
      </Button>
    </nav>
  );
}
