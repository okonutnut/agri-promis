"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getFilteredRowModel,
  ColumnFiltersState,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Search } from "lucide-react";
import { useModal } from "@/components/custom/layout/custom-page-layout";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isPending?: boolean;
  onAdd?: () => void;
  onRowSelectionChange?: (selectedRows: TData[]) => void; // Add this prop
}

export function DataTable<TData, TValue>({
  columns,
  data,
  isPending,
  onAdd,
  onRowSelectionChange,
}: DataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (onRowSelectionChange) {
      const selectedRows = Object.keys(rowSelection).filter(
        (key) => rowSelection[key]
      );
      onRowSelectionChange(
        data.filter((_, index) => selectedRows.includes(index.toString()))
      );
    }
  }, [rowSelection, data]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      columnFilters,
      rowSelection,
    },
  });

  // Modal Hook
  const { openModal, closeModal } = useModal();

  return (
    <div className="space-y-4 m-2">
      <div className="flex items-center justify-between gap-2">
        <div className="relative w-full max-w-md">
          <Input
            placeholder="Search..."
            className="pl-8"
            value={table.getState().globalFilter ?? ""}
            onChange={(event) => table.setGlobalFilter(event.target.value)}
          />
          <Search className="absolute left-2 top-1/2 w-4 h-4 transform -translate-y-1/2 text-gray-500" />
        </div>
        <Button
          onClick={() =>
            openModal(
              "Attention!!!",
              "Are you sure you want to add this user?",
              <Button
                className="w-full"
                onClick={() => {
                  onAdd && onAdd();
                  closeModal();
                }}
              >
                {isPending ? <Loader2 className="animate-spin" /> : "Proceed"}
              </Button>
            )
          }
          disabled={isPending || Object.keys(rowSelection).length === 0}
          variant={isPending ? "ghost" : "default"}
        >
          {isPending ? <Loader2 className="animate-spin" /> : "Assign"}
        </Button>
      </div>

      {/* Table */}
      <div className="relative rounded-md border">
        {isPending && (
          <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10"></div>
        )}
        <Table className={isPending ? "opacity-50 pointer-events-none" : ""}>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="hover:bg-accent"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
