"use client";

import { cn, updateUserLocation } from "@/lib/utils";
import { toast } from "sonner";
import SkeletonLoading from "./skeleton-loading";
import { AppSidebar } from "@/components/sidebar/appSidebar";
import { NavigationItemType } from "@/components/types";
import { useEffect } from "react";
import CustomNavbar from "../navbar/custom-navbar";

type CustomPageLayoutProps = {
  children?: React.ReactNode;
  className?: string;
  pageTitle?: string;
  isLoading?: boolean;
  error?: Error | null;
  noSidebar?: boolean;
  navItems?: NavigationItemType[];
  topRightComponent?: React.ReactNode;
  role?: "admin" | "user";
};
export default function CustomPageLayout({
  children,
  className,
  pageTitle,
  isLoading,
  error,
  noSidebar,
  navItems,
  topRightComponent,
  role,
}: CustomPageLayoutProps) {
  useEffect(() => {
    updateUserLocation();
    const interval = setInterval(() => {
      updateUserLocation();
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <section className="w-full h-screen flex flex-col relative text-sm overflow-hidden">
        {error &&
          toast.error(
            `Error: ${error.message || "An unexpected error occurred"}`
          )}
        <CustomNavbar
          navItems={navItems || []}
          noSidebar={noSidebar}
          pageTitle={pageTitle}
          role={role || "admin"}
        />
        <div className="flex flex-1 overflow-hidden">
          {!noSidebar && <AppSidebar navItems={navItems || []} />}
          <div className="flex-1 w-full overflow-hidden">
            <div className={cn("pl-4 pr-2 h-full flex flex-col", className)}>
              <div className="flex-1 overflow-y-auto py-4">
                <div className="flex justify-between items-start mb-4">
                  <h1 className="text-2xl font-medium">{pageTitle}</h1>
                  {topRightComponent}
                </div>
                {isLoading || error ? <SkeletonLoading /> : <>{children}</>}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
