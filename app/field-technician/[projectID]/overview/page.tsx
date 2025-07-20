"use client";

import UserPageLayout from "@/components/custom/layout/user-page-layout";
import { useSelectProjectDetailsHook } from "@/components/hooks";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useParams } from "next/navigation";

export default function FieldTechnicianPage() {
  const { projectID } = useParams();
  const { data, isLoading, error } = useSelectProjectDetailsHook(
    projectID as string
  );
  return (
    <UserPageLayout isLoading={isLoading} error={error}>
      <div className="py-16 flex justify-between">
        {data && (
          <>
            <span className="text-2xl font-medium">{data?.project_name}</span>
            <Badge
              variant="outline"
              className={`px-5 text-xs ${
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
    </UserPageLayout>
  );
}
