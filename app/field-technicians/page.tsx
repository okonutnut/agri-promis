"use client";

import { ContentWithPanel } from "@/components/custom/layout/content-with-panel";
import { PropertiesPanel } from "@/components/custom/layout/properties-panel";
import { useState } from "react";
import { DataTable } from "./components/data-table";
import { columns, Payment } from "./components/columns";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function FieldTechnicianPage() {
  const panelWidth = "500px";
  const [panelOpen, setPanelOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<Payment | null>(null);
  const [isAddMode, setIsAddMode] = useState(false);

  const handleRowSelect = (row: Payment) => {
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

  const data: Payment[] = [
    {
      id: "728ed52f",
      amount: 100,
      status: "pending",
      email: "m@example.com",
    },
    {
      id: "a1b2c3d4",
      amount: 250,
      status: "success",
      email: "jane.doe@example.com",
    },
    {
      id: "e5f6g7h8",
      amount: 75,
      status: "failed",
      email: "john.smith@example.com",
    },
    {
      id: "i9j0k1l2",
      amount: 180,
      status: "pending",
      email: "alice.wonder@example.com",
    },
    {
      id: "m3n4o5p6",
      amount: 320,
      status: "success",
      email: "bob.builder@example.com",
    },
  ];

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="min-h-[calc(100vh-64px)]"
    >
      <ResizablePanel className="w-full overflow-auto p-3">
        <DataTable
          columns={columns}
          data={data || []}
          onRowSelect={handleRowSelect}
          onAdd={handleAdd}
          isAddMode={isAddMode}
        />
      </ResizablePanel>

      <ResizableHandle />

      <ResizablePanel
        className={`${panelOpen ? "block" : "hidden"} overflow-auto`}
      >
        {isAddMode ? (
          <div className="flex flex-col h-full">
            <div className="text-sm flex justify-between items-center border-b p-3 text-primary uppercase font-semibold">
              Add Payment
              <X
                className="cursor-pointer text-slate-900"
                onClick={handlePanelClose}
              />
            </div>
            <form className="p-3 space-y-4">
              <div>
                <label className="text-sm font-medium">Email</label>
                <input
                  type="email"
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter email"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Amount</label>
                <input
                  type="number"
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter amount"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Status</label>
                <select className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="success">Success</option>
                  <option value="failed">Failed</option>
                </select>
              </div>
            </form>
            <div className="flex gap-2 border-t p-3">
              <Button type="submit" className="flex-1 py-2 px-4">
                Add Payment
              </Button>
              <Button
                type="button"
                onClick={handlePanelClose}
                className="flex-1"
                variant="outline"
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : selectedRow ? (
          <div className="space-y-4">
            <div>
              <div className="text-sm mb-2 flex justify-between items-center border-b p-3 text-primary uppercase font-semibold">
                Payment Details
                <X
                  className="cursor-pointer text-slate-900"
                  onClick={handlePanelClose}
                />
              </div>
              <div className="space-y-2 p-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">ID</span>
                  <span className="text-sm">{selectedRow.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Email</span>
                  <span className="text-sm">{selectedRow.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Amount</span>
                  <span className="text-sm">${selectedRow.amount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <span className="text-sm capitalize">
                    {selectedRow.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center text-muted-foreground">
            Select a row to view details
          </div>
        )}
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
