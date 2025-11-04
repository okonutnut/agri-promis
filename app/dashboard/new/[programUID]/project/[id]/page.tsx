"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useParams } from "next/navigation";
import { useSelectProjectDetailsHook } from "@/components/hooks";
import CustomPageLayout from "@/components/custom/layout/custom-page-layout";
import CreateProjectLocationForm from "@/components/custom/forms/create-project-location";
import { Skeleton } from "@/components/ui/skeleton";

export default function CreateProgramPage() {
  const { id: projectID } = useParams();
  const { data } = useSelectProjectDetailsHook(projectID as string);

  return (
    <CustomPageLayout noSidebar className="p-0">
      <Card className="mx-auto w-full md:w-lg shadow-none md:shadow-xs border-0 md:border p-0">
        <CardContent className="p-0">
          <CardHeader className="border-b space-y-2 p-2">
            <CardTitle className="uppercase text-primary text-xl">
              Create new project location
            </CardTitle>
            <CardDescription>
              This is where you can create a new project for&nbsp;
              {data?.project_name ? (
                <strong>{data.project_name}</strong>
              ) : (
                <Skeleton className="w-20 h-5" />
              )}
            </CardDescription>
          </CardHeader>
          <CreateProjectLocationForm />
        </CardContent>
      </Card>
    </CustomPageLayout>
  );
}
