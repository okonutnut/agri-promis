"use client";

import CustomPageLayout from "@/components/custom/layout/admin-page-layout";
import { useSelectProgramAndProjectDetailsByProgjectIDHook } from "@/components/hooks";
import { getProjectNavItems } from "@/components/sidebar/navitems";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { useParams } from "next/navigation";

export default function DashboardPage() {
  const { projectID } = useParams();
  const { data, isLoading, error } =
    useSelectProgramAndProjectDetailsByProgjectIDHook(projectID as string);

  return (
    <CustomPageLayout
      isLoading={isLoading}
      error={error}
      navItems={getProjectNavItems(projectID as string)}
    >
      <div className="py-16 flex justify-between items-start">
        {data && (
          <>
            <div className="flex flex-col gap-1 text-2xl font-medium">
              {data?.project_name}
              <span className="text-sm text-muted-foreground mt-4">
                Start Date: {format(new Date(data?.start_date), "PP")}
              </span>
              <span className="text-sm text-muted-foreground">
                Estimated End Date: {format(new Date(data?.end_date), "PP")}
              </span>
              <span className="text-sm text-muted-foreground">
                Location: {data.location ?? "Not specified"}
              </span>
            </div>
            <Badge
              variant="outline"
              className={`px-5 h-7 text-xs ${
                data.status === 0
                  ? "text-red-500 border-red-500"
                  : "text-green-500 border-green-500"
              }`}
            >
              {data.status === 0 ? "INACTIVE" : "ACTIVE"}
            </Badge>
          </>
        )}
      </div>
      <Separator className="fixed left-0" />
    </CustomPageLayout>
  );
}
