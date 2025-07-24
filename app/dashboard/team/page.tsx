"use client";

import { useState } from "react";
import { DataTable } from "./table/data-table";
import { columns } from "./table/columns";
import { TeamMemberForm } from "./components/team-members-form";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { UserProfileType } from "@/components/types";
import { useSelectAllMembersHook } from "@/components/hooks";
import CustomPageLayout from "@/components/custom/layout/admin-page-layout";
import { getDashboardNavItems } from "@/components/sidebar/navitems";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

export default function FieldTechnicianPage() {
  const [panelOpen, setPanelOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<UserProfileType | null>(null);
  const [isAddMode, setIsAddMode] = useState(false);

  const handleRowSelect = (row: UserProfileType) => {
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

  const { data, isLoading, error } = useSelectAllMembersHook();

  return (
    <CustomPageLayout
      pageTitle="Team Members"
      isLoading={isLoading}
      error={error}
      navItems={getDashboardNavItems()}
    >
      {data && (
        <>
          <DataTable
            columns={columns}
            data={data || []}
            onRowSelect={handleRowSelect}
            onAdd={handleAdd}
          />
          <Sheet open={panelOpen} onOpenChange={handlePanelClose}>
            <SheetContent className="md:min-w-[600px] w-screen">
              <SheetHeader>
                <SheetTitle className="uppercase text-primary">
                  {isAddMode ? "Invite New Team Member" : "View Member Details"}
                </SheetTitle>
              </SheetHeader>
              <Separator />
              <>
                <TeamMemberForm
                  key={isAddMode ? "add-mode" : selectedRow?.id || "view-mode"}
                  data={isAddMode ? null : selectedRow}
                  setPanelOpen={setPanelOpen}
                />
              </>
              <SheetClose asChild>
                <Button
                  variant="outline"
                  className="absolute bottom-0 right-0 left-0 m-2"
                >
                  Close
                </Button>
              </SheetClose>
            </SheetContent>
          </Sheet>
        </>
      )}
    </CustomPageLayout>
  );
}
