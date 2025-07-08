"use client";

import { useState } from "react";
import { DataTable } from "./table/data-table";
import { columns } from "./table/columns";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { X } from "lucide-react";
import { useFetchAllFieldTechnician } from "./hook/field-tech.hook";
import { UserProfile } from "./types";
import { AddFieldTechnicianForm } from "./components/add-technician-form";
import { Skeleton } from "@/components/ui/skeleton";
import ViewTechnicianForm from "./components/view-technician-form";

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

  const data = useFetchAllFieldTechnician();
  console.log("Data fetched:", data.data);

  return (
    <div className="relative h-full w-full">
      <ResizablePanelGroup direction="horizontal" className="h-full">
        <ResizablePanel className="w-full overflow-y-auto overflow-x-auto p-3">
          {data.isLoading ? (
            <>
              <Skeleton className="h-16 w-full mb-4" />
              <Skeleton className="h-96 w-full" />
            </>
          ) : (
            <DataTable
              columns={columns}
              data={data.data || []}
              onRowSelect={handleRowSelect}
              onAdd={handleAdd}
              isAddMode={isAddMode}
            />
          )}
        </ResizablePanel>

        <ResizableHandle
          className={panelOpen ? "block" : "hidden"}
          withHandle={panelOpen}
        />

        <ResizablePanel
          minSize={panelOpen ? 50 : 0}
          maxSize={panelOpen ? 95 : 0}
          className={`${panelOpen ? "block" : "hidden"} overflow-x-auto`}
        >
          {panelOpen && (
            <div>
              {isAddMode ? (
                <div className="flex flex-col h-full">
                  <div className="text-sm flex justify-between items-center border-b p-3 text-primary uppercase font-semibold">
                    Add New Field Technician
                    <X
                      className="cursor-pointer text-slate-900"
                      onClick={handlePanelClose}
                    />
                  </div>
                  <AddFieldTechnicianForm
                    isAddMode={isAddMode}
                    h-16
                    onClose={handlePanelClose}
                  />
                </div>
              ) : selectedRow ? (
                <div className="space-y-4">
                  <div>
                    <div className="text-sm mb-2 flex justify-between items-center border-b p-3 text-primary uppercase font-semibold">
                      Field Technician Details
                      <X
                        className="cursor-pointer text-slate-900"
                        onClick={handlePanelClose}
                      />
                    </div>
                    <ViewTechnicianForm selectedRow={selectedRow} />
                  </div>
                </div>
              ) : (
                <div className="text-center text-muted-foreground">
                  Select a row to view details
                </div>
              )}
            </div>
          )}
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
