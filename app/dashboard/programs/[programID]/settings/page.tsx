"use client";

import { Card, CardContent } from "@/components/ui/card";
import EditProgramNameForm from "./form/edit-program-name-form";
import { useParams } from "next/navigation";
import { useSelectProgramByIDHook } from "@/components/hooks";
import CustomPageLayout from "@/components/custom/layout/admin-page-layout";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ProgramSettingsPage() {
  const { programID } = useParams();
  const { data, isLoading, error } = useSelectProgramByIDHook(
    programID as string
  );
  return (
    <CustomPageLayout
      pageTitle="Program Settings"
      isLoading={isLoading}
      error={error}
    >
      {data && (
        <section className="space-y-8">
          <Card className="shadow-xs">
            <CardContent className="flex flex-wrap justify-between items-start">
              <div className="font-semibold w-full mb-4">General Settings</div>
              <EditProgramNameForm programData={data} />
            </CardContent>
          </Card>
          <Card className="shadow-xs bg-red-50 border-red-200">
            <CardContent className="flex flex-col flex-wrap justify-between items-start space-y-4">
              <div className="flex gap-2 items-center font-semibold w-full mb-4 text-red-600">
                <AlertCircle />
                Danger Zone
              </div>
              <span>
                Deleting a program will remove all associated projects and data.
                This action cannot be undone.
              </span>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  // Handle delete program logic here
                }}
              >
                Delete Program
              </Button>
            </CardContent>
          </Card>
        </section>
      )}
    </CustomPageLayout>
  );
}
