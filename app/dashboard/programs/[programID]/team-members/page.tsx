"use client";

import { useState } from "react";
import { DataTable } from "./table/data-table";
import { columns } from "./table/columns";
import { TeamMemberForm } from "./components/team-members-form";
import NewNavbar from "@/components/custom/navbar/navbar";
import { ProgramSidebar } from "@/components/sidebar/program-sidebar";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { UserProfile } from "@/components/types";
import { useSelectAllMembersHook } from "@/components/hooks";

export default function FieldTechnicianPage() {
  const [panelOpen, setPanelOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<UserProfile | null>(null);
  const [isAddMode, setIsAddMode] = useState(false);

  const handleRowSelect = (row: UserProfile) => {
    setSelectedRow(row);
    setIsAddMode(false);
    setPanelOpen(true);
  };

  const handleAdd = () => {
    setSelectedRow(null);
    setIsAddMode(true);
    setPanelOpen(true);
  };

  const handlePanelClose = () => {
    setPanelOpen(false);
    setIsAddMode(false);
    setSelectedRow(null);
  };

  const { data } = useSelectAllMembersHook();

  return (
    <section className="w-full h-screen relative">
      <NewNavbar />
      <div className="flex">
        <ProgramSidebar />
        <div className="container mx-auto p-4 space-y-4">
          <h1 className="text-2xl font-semibold text-primary">Team Members</h1>
          <DataTable
            columns={columns}
            data={data || []}
            onRowSelect={handleRowSelect}
            onAdd={handleAdd}
          />
          <Sheet open={panelOpen} onOpenChange={handlePanelClose}>
            <SheetContent className="min-w-[600px] md:min-w-[600px] min-w-screen sm:min-w-[400px]">
              <SheetHeader>
                <SheetTitle className="uppercase text-primary">
                  {isAddMode ? "Invite New Team Member" : "View Member Details"}
                </SheetTitle>
                <SheetDescription>
                  This action cannot be undone. This will permanently delete
                  your account and remove your data from our servers.
                </SheetDescription>
              </SheetHeader>
              <>
                <TeamMemberForm
                  key={isAddMode ? "add-mode" : selectedRow?.id || "view-mode"}
                  data={isAddMode ? null : selectedRow}
                />
              </>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </section>
  );
}
