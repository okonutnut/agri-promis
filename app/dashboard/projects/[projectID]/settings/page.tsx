"use client";

import { Card, CardContent } from "@/components/ui/card";
import EditProgramNameForm from "./form/edit-project-name-form";
import CustomPageLayout from "@/components/custom/layout/page-layout";

export default function ProgramSettingsPage() {
  return (
    <CustomPageLayout>
      <h1 className="text-2xl font-medium text-primary mb-4">
        Project Settings
      </h1>
      <Card className="shadow-xs">
        <CardContent className="flex flex-wrap justify-between items-start">
          <div className="font-semibold w-full mb-4">General Settings</div>
          <EditProgramNameForm />
        </CardContent>
      </Card>
    </CustomPageLayout>
  );
}
