"use client";

import NewNavbar from "@/components/custom/navbar/navbar";
import { ProgramSidebar } from "@/components/sidebar/program-sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { useParams } from "next/navigation";
import EditProgramNameForm from "./form/edit-program-name-form";

export default function ProgramSettingsPage() {
  const { programID } = useParams();

  return (
    <section className="w-full h-screen flex flex-col relative">
      <NewNavbar />
      <div className="flex">
        <ProgramSidebar />
        <div className="container mx-auto p-4">
          <h1 className="text-2xl font-semibold text-primary mb-4">
            Program Settings
          </h1>
          <Card className="shadow-xs">
            <CardContent className="flex justify-between items-start">
              <div className="text-xs font-semibold w-full">
                General Settings
              </div>
              <EditProgramNameForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
