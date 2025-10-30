"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import CreateProgramForm from "@/components/custom/forms/create-program-form";
import CustomPageLayout from "@/components/custom/layout/custom-page-layout";

export default function CreateProgramPage() {
  return (
    <CustomPageLayout noSidebar className="p-0">
      <Card className="mx-auto w-full md:w-lg shadow-none md:shadow-xs border-0 md:border p-0">
        <CardContent className="p-0">
          <CardHeader className="border-b p-2">
            <CardTitle className="uppercase text-primary text-lg">
              Create new program
            </CardTitle>
            <CardDescription className="text-muted-foreground text-xs">
              This is where you can create a new program to manage your
              agricultural projects.
            </CardDescription>
          </CardHeader>
          <CreateProgramForm />
        </CardContent>
      </Card>
    </CustomPageLayout>
  );
}
