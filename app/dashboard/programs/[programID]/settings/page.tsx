"use client";

import { Card, CardContent } from "@/components/ui/card";
import EditProgramNameForm from "./form/edit-program-name-form";
import { useParams } from "next/navigation";
import { useSelectProgramByIDHook } from "@/components/hooks";
import CustomPageLayout from "@/components/custom/layout/custom-page-layout";
import { getProgramNavItems } from "@/components/sidebar/navitems";
import DeleteProgramCard from "./components/delete-program-card";

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
      navItems={getProgramNavItems(programID as string)}
    >
      {data && (
        <>
          <Card className="shadow-xs mb-4">
            <CardContent className="flex flex-wrap justify-between items-start">
              <div className="font-semibold w-full mb-4">General Settings</div>
              <EditProgramNameForm programData={data} />
            </CardContent>
          </Card>
          <DeleteProgramCard data={data} />
        </>
      )}
    </CustomPageLayout>
  );
}
