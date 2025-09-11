"use client";

import dynamic from "next/dynamic";
import { Card, CardContent } from "@/components/ui/card";
import { useParams } from "next/navigation";
import CustomPageLayout from "@/components/custom/layout/custom-page-layout";
import { getProgramNavItems } from "@/components/sidebar/navitems";
import { ProgramType } from "@/components/types";
import { useMemo } from "react";
import { useSupabaseSession } from "@/hooks/use-session";
import { useRealtimeQuery } from "@/hooks/use-realtime";
import { SelectProgramByIdAction } from "@/app/actions/ProgramAction";
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

  const { data: userData } = useSupabaseSession();
  const { data, isLoading, error } = useRealtimeQuery({
    queryKey: ["programDetails"],
    queryFn: () => SelectProgramByIdAction(programID as string),
    table: "programs",
  });

  const isAdmin = useMemo(() => {
    return userData?.user.id === data?.admin_id;
  }, [userData, data]);

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
          <EditProgramNameForm
            programData={data as ProgramType}
            isAdmin={isAdmin}
          />
        </CardContent>
      </Card>
      {isAdmin && <DeleteProgramCard data={data as ProgramType} />}
    </CustomPageLayout>
  );
}
