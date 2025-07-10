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
import { LocationType } from "./types";
import LocationPageForm from "./components/location-form";
import { Skeleton } from "@/components/ui/skeleton";
import { SelectAllLocationHook } from "./hook";

export default function LocationPage() {
  const [panelOpen, setPanelOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<LocationType | null>(null);
  const [isAddMode, setIsAddMode] = useState(false);

  const handleRowSelect = (row: LocationType) => {
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

  const { data: locationData, isLoading } = SelectAllLocationHook();

  return (
    <div className="relative h-full w-full">
      <ResizablePanelGroup direction="horizontal" className="h-full">
        <ResizablePanel className="w-full overflow-y-auto overflow-x-auto p-3">
          {isLoading ? (
            <>
              <Skeleton className="h-16 w-full mb-4" />
              <Skeleton className="h-96 w-full" />
            </>
          ) : (
            <DataTable
              columns={columns}
              data={locationData || []}
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
                    Add New Location
                    <X
                      className="cursor-pointer text-slate-900"
                      onClick={() => handlePanelClose()}
                    />
                  </div>
                  <LocationPageForm />
                </div>
              ) : selectedRow ? (
                <div className="space-y-4">
                  <div>
                    <div className="text-sm mb-2 flex justify-between items-center border-b p-3 text-primary uppercase font-semibold">
                      Location Details
                      <X
                        className="cursor-pointer text-slate-900"
                        onClick={() => handlePanelClose()}
                      />
                    </div>
                    <LocationPageForm selectedRow={selectedRow} />
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
