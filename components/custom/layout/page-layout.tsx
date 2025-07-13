import { useParams } from "next/navigation";
import Navbar from "../navbar/navbar";
import { ProgramSidebar } from "@/components/sidebar/program-sidebar";
import { ProjectSidebar } from "@/components/sidebar/project-sidebar";
import { cn } from "@/lib/utils";

type CustomPageLayoutProps = {
  children?: React.ReactNode;
  className?: string;
};
export default function CustomPageLayout({
  children,
  className,
}: CustomPageLayoutProps) {
  const { programID, projectID } = useParams();
  return (
    <section className="w-full h-screen flex flex-col relative">
      <Navbar />
      <div className="flex">
        <>
          {programID && <ProgramSidebar />}
          {projectID && <ProjectSidebar />}
        </>
        <div className={cn(`container mx-auto p-4`, className)}>{children}</div>
      </div>
    </section>
  );
}
