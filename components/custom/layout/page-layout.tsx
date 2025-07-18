import { useParams } from "next/navigation";
import Navbar from "../navbar/navbar";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import SkeletonLoading from "./skeleton-loading";
import { AppSidebar } from "@/components/sidebar/appSidebar";
import {
  getProgramNavItems,
  getProjectNavItems,
} from "@/components/sidebar/navitems";

type CustomPageLayoutProps = {
  children?: React.ReactNode;
  className?: string;
  pageTitle?: string;
  isLoading?: boolean;
  error?: Error | null;
  noSidebar?: boolean;
};
export default function CustomPageLayout({
  children,
  className,
  pageTitle,
  isLoading,
  error,
  noSidebar,
}: CustomPageLayoutProps) {
  const { programID, projectID } = useParams();
  return (
    <section className="w-full h-screen flex flex-col relative text-sm">
      {error &&
        toast.error(
          `Error: ${error.message || "An unexpected error occurred"}`
        )}
      <Navbar noSidebar={noSidebar} />
      <div className="flex">
        {!noSidebar && (
          <AppSidebar
            navItems={
              projectID
                ? getProjectNavItems(projectID as string)
                : programID
                ? getProgramNavItems(programID as string)
                : []
            }
          />
        )}
        <div className={cn(`container mx-auto p-4`, className)}>
          <h1 className="text-2xl font-medium mb-4">{pageTitle}</h1>
          {isLoading || error ? <SkeletonLoading /> : <>{children}</>}
        </div>
      </div>
    </section>
  );
}
