"use client";

import CustomPageLayout from "@/components/custom/layout/page-layout";
import { useSelectProgramAndProjectDetailsByProgjectIDHook } from "@/components/hooks";
import { Separator } from "@/components/ui/separator";
import { Dot } from "lucide-react";
import { useParams } from "next/navigation";

export default function DashboardPage() {
  const { projectID } = useParams();
  const { data: projectData } =
    useSelectProgramAndProjectDetailsByProgjectIDHook(projectID as string);
  return (
    <CustomPageLayout>
      <div className="py-16 flex justify-between">
        {projectData && (
          <>
            <span className="text-2xl font-medium">
              {projectData?.project_name}
            </span>
            <span
              className={`inline-flex items-center px-3 py-1 rounded border text-sm font-medium ${
                projectData?.status === 0
                  ? "border-red-400 text-red-500 bg-red-50"
                  : "border-green-400 text-green-500 bg-green-50"
              }`}
            >
              <Dot
                className="mr-2"
                color={projectData?.status === 0 ? "#f87171" : "#34d399"}
                size={24}
                fill={projectData?.status === 0 ? "#f87171" : "#34d399"}
              />
              {projectData?.status === 0 ? "INACTIVE" : "ACTIVE"}
            </span>
          </>
        )}
      </div>
      <Separator className="fixed left-0" />
    </CustomPageLayout>
  );
}
