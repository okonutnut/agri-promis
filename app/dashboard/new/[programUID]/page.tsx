"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import CreateProjectForm from "@/components/custom/forms/create-project-form";
import { useParams } from "next/navigation";
import { useSelectProgramByIDHook } from "@/components/hooks";
import CustomPageLayout from "@/components/custom/layout/admin-page-layout";

export default function CreateProgramPage() {
  const { programUID } = useParams();
  const { data } = useSelectProgramByIDHook(programUID as string);

  return (
    <CustomPageLayout noSidebar className="p-0">
      <Card className="mx-auto w-full md:w-lg shadow-none md:shadow-xs border-0 md:border">
        <CardContent className="p-0">
          <CardHeader className="border-b space-y-2">
            <CardTitle className="uppercase text-primary">
              Create new project
            </CardTitle>
            <CardDescription>
              This is where you can create a new project for{" "}
              <strong>{data?.program_name}</strong>.
            </CardDescription>
          </CardHeader>
          <CreateProjectForm />
        </CardContent>
      </Card>
    </CustomPageLayout>
  );
}
