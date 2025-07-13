"use client";

import CustomPageLayout from "@/components/custom/layout/page-layout";
import { useSelectProgramAndProjectDetailsByProgjectIDHook } from "@/components/hooks";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
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
            <Badge variant="outline">
              <Dot className="mr-2" />
              {projectData?.status === 0 ? "INACTIVE" : "ACTIVE"}
            </Badge>
          </>
        )}
      </div>
      <Separator className="fixed left-0" />
      <div className="py-16">
        <Card></Card>
      </div>
    </CustomPageLayout>
  );
}
