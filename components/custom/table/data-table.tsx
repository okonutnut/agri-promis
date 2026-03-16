"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  ColumnFiltersState,
  SortingState,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import SearchInput from "@/components/custom/input/search-input";
import { useModal } from "@/components/custom/layout/custom-page-layout";
import { cn } from "@/lib/utils";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];

  // Row interactions
  onRowSelect?: (row: TData) => void;
  onRowSelectionChange?: (selectedRows: TData[]) => void;

  // Add action
  onAdd?: () => void;
  addButtonLabel?: string;

  // Search & toolbar
  hideSearch?: boolean;
  topComponent?: (setGlobalFilter: (value: string) => void) => React.ReactNode;
  toolbarContent?: React.ReactNode;

  // Loading state
  isPending?: boolean;

  // Confirmation on add
  confirmOnAdd?: boolean;
  confirmTitle?: string;
  confirmMessage?: string;
  confirmButtonLabel?: string;

  // Styling
  className?: string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  onRowSelect,
  onRowSelectionChange,
  onAdd,
  addButtonLabel = "Create New",
  hideSearch = false,
  topComponent,
  toolbarContent,
  isPending = false,
  confirmOnAdd = false,
  confirmTitle = "Attention",
  confirmMessage = "Are you sure you want to proceed?",
  confirmButtonLabel = "Proceed",
  className,
}: DataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const { openModal, closeModal } = useModal();

  const isRowSelectionMode = !!onRowSelectionChange;

  useEffect(() => {
    if (onRowSelectionChange) {
      const selectedKeys = Object.keys(rowSelection).filter(
        (key) => rowSelection[key],
      );
      onRowSelectionChange(
        data.filter((_, index) => selectedKeys.includes(index.toString())),
      );
    }
  }, [rowSelection, data, onRowSelectionChange]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    onSortingChange: setSorting,
    ...(isRowSelectionMode && { onRowSelectionChange: setRowSelection }),
    state: {
      columnFilters,
      sorting,
      ...(isRowSelectionMode && { rowSelection }),
    },
  });

  const handleAdd = () => {
    if (!onAdd) return;

    if (confirmOnAdd) {
      openModal(
        confirmTitle,
        confirmMessage,
        <Button
          className="w-full"
          onClick={() => {
            onAdd();
            closeModal();
          }}
        >
          {isPending ? (
            <Loader2 className="animate-spin" />
          ) : (
            confirmButtonLabel
          )}
        </Button>,
      );
    } else {
      onAdd();
    }
  };

  const isAddDisabled = isRowSelectionMode
    ? isPending || Object.keys(rowSelection).length === 0
    : isPending;

  const renderToolbar = () => {
    if (topComponent) {
      return topComponent(table.setGlobalFilter);
    }

    const hasAddButton = !!onAdd;
    const hasToolbarContent = !!toolbarContent;

    if (hideSearch && !hasAddButton && !hasToolbarContent) return null;

    return (
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {!hideSearch && (
            <SearchInput
              setSearchTerm={table.setGlobalFilter}
              className="w-full max-w-md"
            />
          )}
          {toolbarContent}
        </div>
        {hasAddButton && (
          <Button
            onClick={handleAdd}
            size="sm"
            disabled={isAddDisabled}
            variant={isPending ? "ghost" : "default"}
          >
            {isPending ? <Loader2 className="animate-spin" /> : addButtonLabel}
          </Button>
        )}
      </div>
    );
  };

  return (
    <div className={cn("space-y-4", className)}>
      {renderToolbar()}

      <div className="relative rounded-md border">
        {isPending && isRowSelectionMode && (
          <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10" />
        )}
        <Table
          className={
            isPending && isRowSelectionMode
              ? "opacity-50 pointer-events-none"
              : ""
          }
        >
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={cn(
                    "hover:bg-accent",
                    onRowSelect && "cursor-pointer",
                  )}
                  onClick={() => onRowSelect?.(row.original)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
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

      {data.length > 10 && (
        <div className="flex items-center justify-start space-x-2 py-4">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="text-sm text-muted-foreground">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
