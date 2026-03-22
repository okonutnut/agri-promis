"use client";

import { useMemo, useState } from "react";
import { DataTable } from "./table/data-table";
import { columns } from "./table/columns";
import { FieldReportsForm } from "./components/field-reports-form";
import CustomPageLayout, {
  useSheet,
} from "@/components/custom/layout/custom-page-layout";
import { useParams } from "next/navigation";
import { getProjectLocationNavItems } from "@/components/sidebar/navitems";
import { MonitoringReportType } from "@/components/types";
import { useRealtimeQuery } from "@/hooks/use-realtime";
import { usePreGenerateSummaries } from "@/hooks/use-pre-generate-summaries";
import { SelectAllMonitoringReportsByProjectIDAction } from "@/app/actions/MonitoringAction";
import YearsDropdown from "@/components/custom/dropdown/years-dropdown";
import SearchInput from "@/components/custom/input/search-input";

type MonitoringReportContentProps = {
  data: MonitoringReportType[] | undefined;
  yearFilter: string;
  onYearFilterChange: (year: string) => void;
};
function MonitoringReportContent({
  data,
  yearFilter,
  onYearFilterChange,
}: MonitoringReportContentProps) {
  const { openSheet } = useSheet();

  const handleRowSelect = (row: MonitoringReportType) => {
    openSheet(
      "Monitoring Report Details",
      <FieldReportsForm data={row} key={`view-${row.id}`} />,
    );
  };

  // Filter data by year
  const filteredData = useMemo(() => {
    const isInSelectedYear = (
      dateString: string | undefined | null,
    ): boolean => {
      if (!dateString) return false;
      if (!yearFilter || yearFilter === "all") return true;
      const date = new Date(dateString);
      return date.getFullYear().toString() === yearFilter;
    };
    if (!data) return [];
    return data.filter((report) => isInSelectedYear(report.created_at));
  }, [data, yearFilter]);

  if (!data) return null;

  // Ensure YearsDropdown defaults to "all"
  // (Handled in parent: useState("all") and YearsDropdown onChange)

  return (
    <div className="space-y-4">
      <DataTable
        columns={columns}
        data={filteredData || []}
        onRowSelect={handleRowSelect}
        topComponent={(setGlobalFilter) => (
          <div className="flex items-center justify-between gap-4">
            <SearchInput
              setSearchTerm={setGlobalFilter}
              className="w-full max-w-md"
            />
            <YearsDropdown onChange={onYearFilterChange} />
          </div>
        )}
        hideSearch={true}
      />
    </div>
  );
}

export default function MonitoringReportPage() {
  const { locationID } = useParams();
  const [yearFilter, setYearFilter] = useState("all");

  const { data, isLoading, error } = useRealtimeQuery({
    queryKey: ["monitoring-reports", locationID as string],
    queryFn: () =>
      SelectAllMonitoringReportsByProjectIDAction(locationID as string),
    table: "monitoring",
  });

  usePreGenerateSummaries({
    reportType: "monitoring",
    reports: data,
  });

  console.log("Monitoring reports data:", data);

  return (
    <CustomPageLayout
      pageTitle="Monitoring Reports"
      pageDescription="View and manage monitoring reports for the project."
      navItems={getProjectLocationNavItems(locationID as string)}
      isLoading={isLoading}
      error={error}
    >
      <MonitoringReportContent
        data={data ?? undefined}
        yearFilter={yearFilter}
        onYearFilterChange={setYearFilter}
      />
    </CustomPageLayout>
  );
}
