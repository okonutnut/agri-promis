"use client";

import Navbar from "../navbar/admin-navbar";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import SkeletonLoading from "./skeleton-loading";
import { AppSidebar } from "@/components/sidebar/appSidebar";
import { NavigationItemType } from "@/components/types";

type CustomPageLayoutProps = {
  children?: React.ReactNode;
  className?: string;
  pageTitle?: string;
  isLoading?: boolean;
  error?: Error | null;
  noSidebar?: boolean;
  navItems?: NavigationItemType[];
};
export default function CustomPageLayout({
  children,
  className,
  pageTitle,
  isLoading,
  error,
  noSidebar,
  navItems,
}: CustomPageLayoutProps) {
  return (
    <section className="w-full h-screen flex flex-col relative text-sm">
      {error &&
        toast.error(
          `Error: ${error.message || "An unexpected error occurred"}`
        )}
      <Navbar sidebarOptions={navItems || []} noSidebar={noSidebar} />
      <div className="flex">
        {!noSidebar && <AppSidebar navItems={navItems || []} />}
        <div className={cn(`container mx-auto p-4`, className)}>
          <h1 className="text-2xl font-medium mb-4">{pageTitle}</h1>
          {isLoading || error ? <SkeletonLoading /> : <>{children}</>}
        </div>
      </div>
    </section>
  );
}
