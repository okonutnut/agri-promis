"use client";

import { useParams } from "next/navigation";
import { getProgramNavItems } from "@/components/sidebar/navitems";
import { ProgramType } from "@/components/types";
import { useMemo } from "react";
import { useSupabaseSession } from "@/hooks/use-session";
import { useRealtimeQuery } from "@/hooks/use-realtime";
import { SelectProgramByIdAction } from "@/app/actions/ProgramAction";
import CustomPageLayout from "@/components/custom/layout/custom-page-layout";
import EditProgramNameForm from "./form/edit-program-name-form";
import DeleteProgramCard from "./components/delete-program-card";

export default function ProgramSettingsPage() {
  const { programID } = useParams();

  const { data: userData } = useSupabaseSession();
  const { data, isLoading, error } = useRealtimeQuery({
    queryKey: ["programDetails", programID as string],
    queryFn: () => SelectProgramByIdAction(programID as string),
    table: "programs",
  });

  const isAdmin = useMemo(() => {
    return userData?.user.id === data?.admin_id;
  }, [userData, data]);

  return (
    <CustomPageLayout
      pageTitle="Program Settings"
      pageDescription="Manage program details and settings."
      isLoading={isLoading}
      error={error}
      navItems={getProgramNavItems(programID as string)}
    >
      <EditProgramNameForm
        programData={data as ProgramType}
        isAdmin={isAdmin}
      />
      {isAdmin && <DeleteProgramCard data={data as ProgramType} />}
    </CustomPageLayout>
  );
}
