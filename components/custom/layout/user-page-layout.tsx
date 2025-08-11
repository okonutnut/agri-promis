"use client";

import { useParams } from "next/navigation";
import { cn, updateUserLocation } from "@/lib/utils";
import { toast } from "sonner";
import SkeletonLoading from "./skeleton-loading";
import { AppSidebar } from "@/components/sidebar/appSidebar";
import { getFieldTechnicianNavItems } from "@/components/sidebar/navitems";
import UserNavbar from "../navbar/user-navbar";
import { useEffect } from "react";

type UserPageLayoutProps = {
  children?: React.ReactNode;
  className?: string;
  pageTitle?: string;
  isLoading?: boolean;
  error?: Error | null;
  noSidebar?: boolean;
  topRightComponent?: React.ReactNode;
};
export default function UserPageLayout({
  children,
  className,
  pageTitle,
  isLoading,
  error,
  noSidebar,
  topRightComponent,
}: UserPageLayoutProps) {
  const { projectID } = useParams();
  useEffect(() => {
    updateUserLocation();
    const interval = setInterval(() => {
      updateUserLocation();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="w-full h-screen flex flex-col relative text-sm">
      {error &&
        toast.error(
          `Error: ${error.message || "An unexpected error occurred"}`
        )}
      <UserNavbar noSidebar={noSidebar} />
      <div className="flex">
        {!noSidebar && (
          <AppSidebar
            navItems={getFieldTechnicianNavItems(projectID as string)}
          />
        )}
        <div className={cn(`container mx-auto p-4`, className)}>
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-medium mb-4">{pageTitle}</h1>
            {!isLoading && !error && topRightComponent}
          </div>
          {isLoading || error ? <SkeletonLoading /> : children}
        </div>
      </div>
    </section>
  );
}
