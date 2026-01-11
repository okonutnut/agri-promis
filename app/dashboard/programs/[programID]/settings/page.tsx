"use client";

import { useParams } from "next/navigation";
import { getProgramNavItems } from "@/components/sidebar/navitems";
import { ProgramType } from "@/components/types";
import { useRealtimeQuery } from "@/hooks/use-realtime";
import { SelectProgramByIdAction } from "@/app/actions/ProgramAction";
import CustomPageLayout from "@/components/custom/layout/custom-page-layout";
import EditProgramNameForm from "./form/edit-program-name-form";
import DeleteProgramCard from "./components/delete-program-card";

export default function ProgramSettingsPage() {
  const { programID } = useParams();

  const { data, isLoading, error } = useRealtimeQuery({
    queryKey: ["programDetails", programID as string],
    queryFn: () => SelectProgramByIdAction(programID as string),
    table: "programs",
  });

  return (
    <CustomPageLayout
      pageTitle="Program Settings"
      pageDescription="Manage program details and settings."
      isLoading={isLoading}
      error={error}
      navItems={getProgramNavItems(programID as string)}
    >
      <EditProgramNameForm programData={data as ProgramType} />
      <DeleteProgramCard data={data as ProgramType} />
    </CustomPageLayout>
  );
}
