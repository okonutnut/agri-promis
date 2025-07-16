import { useParams } from "next/navigation";
import Navbar from "../navbar/navbar";
import { ProgramSidebar } from "@/components/sidebar/program-sidebar";
import { ProjectSidebar } from "@/components/sidebar/project-sidebar";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import SkeletonLoading from "./skeleton-loading";

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
    <section className="w-full h-screen flex flex-col relative text-xs">
      {error &&
        toast.error(
          "An error occurred while loading the page. Please try again later."
        )}
      <Navbar noSidebar={noSidebar} />
      <div className="flex">
        <>
          {programID && <ProgramSidebar />}
          {projectID && <ProjectSidebar />}
        </>
        <div className={cn(`container mx-auto p-4`, className)}>
          <h1 className="text-2xl font-medium text-primary mb-4">
            {pageTitle}
          </h1>
          {isLoading ? <SkeletonLoading /> : <>{children}</>}
        </div>
      </div>
    </section>
  );
}
