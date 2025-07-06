"use client";

import { ContentWithPanel } from "@/components/custom/layout/content-with-panel";
import { PropertiesPanel } from "@/components/custom/layout/properties-panel";
import { useState } from "react";
import { DataTable } from "./components/data-table";
import { columns, Payment } from "./components/columns";

export default function Home() {
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
    <>
      <ContentWithPanel panelOpen={panelOpen}>
        <div className="w-full h-screen">
          <section className="w-full overflow-auto">
            <div className="border p-4">
              <DataTable
                columns={columns}
                data={data || []}
                onRowSelect={handleRowSelect}
                onAdd={handleAdd}
                isAddMode={isAddMode}
              />
            </div>
          </section>
        </div>
      </ContentWithPanel>

      <PropertiesPanel isOpen={panelOpen} onClose={handlePanelClose}>
        {isAddMode ? (
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium mb-4">Add New Payment</h4>
              <form className="space-y-4">
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
                <div className="flex gap-2 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Add Payment
                  </button>
                  <button
                    type="button"
                    onClick={handlePanelClose}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : selectedRow ? (
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium mb-2">Payment Details</h4>
              <div className="space-y-2">
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
      </PropertiesPanel>
    </>
  );
}
