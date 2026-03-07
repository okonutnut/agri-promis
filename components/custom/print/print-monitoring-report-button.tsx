"use client";

import { Button } from "@/components/ui/button";
import { pdf } from "@react-pdf/renderer";
import { Download, Printer, Loader2 } from "lucide-react";
import { useState } from "react";
import MonitoringReportReactPDF from "./monitoring-report-react-pdf";
import { MonitoringReportType } from "@/components/types";

type PrintMonitoringReportButtonProps = {
  data: MonitoringReportType;
  btnName?: string;
  variant?:
    | "default"
    | "outline"
    | "ghost"
    | "link"
    | "destructive"
    | "secondary";
  size?: "default" | "sm" | "lg" | "icon";
};

export default function PrintMonitoringReportButton({
  data,
  btnName = "Print",
  variant = "outline",
  size = "sm",
}: PrintMonitoringReportButtonProps) {
  const [isPrinting, setIsPrinting] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const handlePrint = async () => {
    setIsPrinting(true);
    try {
      const blob = await pdf(
        <MonitoringReportReactPDF data={data} />,
      ).toBlob();
      const url = URL.createObjectURL(blob);

      const newWindow = window.open(url, "_blank");

      if (
        !newWindow ||
        newWindow.closed ||
        typeof newWindow.closed === "undefined"
      ) {
        const link = document.createElement("a");
        link.href = url;
        link.download = `monitoring-report-${Date.now()}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 1000);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsPrinting(false);
    }
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const blob = await pdf(
        <MonitoringReportReactPDF data={data} />,
      ).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `monitoring-report-${Date.now()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 1000);
    } catch (error) {
      console.error("Error downloading PDF:", error);
      alert("Failed to download PDF. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  const disabled = isPrinting || isDownloading;

  return (
    <div className="flex items-center gap-2">
      <Button
        variant={variant}
        size={size}
        className="flex items-center gap-2"
        onClick={handlePrint}
        disabled={disabled}
      >
        {isPrinting ? (
          <>
            <Loader2 className="animate-spin" />
            Generating...
          </>
        ) : (
          <>
            {btnName} <Printer />
          </>
        )}
      </Button>
      <Button
        variant={variant}
        size={size}
        className="flex items-center gap-2"
        onClick={handleDownload}
        disabled={disabled}
      >
        {isDownloading ? (
          <>
            <Loader2 className="animate-spin" />
            Downloading...
          </>
        ) : (
          <>
            Download <Download />
          </>
        )}
      </Button>
    </div>
  );
}
