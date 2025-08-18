"use client";

import dynamic from "next/dynamic";
import { Card, CardContent } from "@/components/ui/card";
import { useParams } from "next/navigation";
import { useSelectProgramByIDHook } from "@/components/hooks";
import CustomPageLayout from "@/components/custom/layout/custom-page-layout";
import { getProgramNavItems } from "@/components/sidebar/navitems";
import { ProgramType } from "@/components/types";

const EditProgramNameForm = dynamic(
  () => import("./form/edit-program-name-form"),
  {
    ssr: false,
  }
);
const DeleteProgramCard = dynamic(
  () => import("./components/delete-program-card"),
  {
    ssr: false,
  }
);

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
      <Card className="shadow-xs mb-4">
        <CardContent className="flex flex-wrap justify-between items-start">
          <span className="text-xl font-semibold w-full mb-4">
            General Settings
          </span>
          <EditProgramNameForm programData={data as ProgramType} />
        </CardContent>
      </Card>
      <DeleteProgramCard data={data as ProgramType} />
    </CustomPageLayout>
  );
}
