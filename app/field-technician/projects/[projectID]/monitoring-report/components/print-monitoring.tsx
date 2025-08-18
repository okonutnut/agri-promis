"use client";

import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { MonitoringReportType } from "@/components/types";
const MonitoringTemplate = dynamic(
  () => import("@/components/custom/print/monitoring-template"),
  {
    ssr: false,
  }
);

type PrintMonitoringButtonProps = {
  data: MonitoringReportType | null;
};
export default function PrintMonitoringButton({
  data,
}: PrintMonitoringButtonProps) {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    pageStyle: `
      @page { size: A4; margin: 10mm; }
      @media print { 
        body { -webkit-print-color-adjust: exact; }
        .no-print { display: none !important; }
      }
    `,
    documentTitle: `Monitoring_${new Date().toLocaleDateString()}`,
  });

  return (
    <>
      <Button onClick={handlePrint} variant={"secondary"} size={"sm"}>
        Print Document
      </Button>
      <MonitoringTemplate ref={printRef} data={data} />
    </>
  );
}
