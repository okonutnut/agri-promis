"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PDFDownloadLink, pdf } from "@react-pdf/renderer";
import { ChevronDown, Download, Printer } from "lucide-react";
// import { generateReportDocx } from "@/components/custom/pdf/monitoring-reports-docx";
import { MonitoringReportType } from "@/components/types";

type PrintDownloadDropdownProps = {
  data: React.ReactElement<import("@react-pdf/renderer").DocumentProps>;
  values: MonitoringReportType;
};

export default function PrintDownloadDropdown({
  data,
  values,
}: PrintDownloadDropdownProps) {
  const docName = `monitoring-report-${Date.now()}`;
  // PRINT
  const handleOpenInNewTab = async () => {
    const blob = await pdf(data).toBlob();
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  };

  // WORD
  // const generateWordDocument = async () => {
  //   const resp = await generateReportDocx(values);
  //   const blob = await resp.blob();
  //   const url = URL.createObjectURL(blob);
  //   const a = document.createElement("a");
  //   a.href = url;
  //   a.download = docName + ".docx";
  //   a.click();
  //   URL.revokeObjectURL(url);
  // };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size={"sm"}
          className="flex items-center gap-2"
        >
          Export <ChevronDown />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="m-1 min-w-[150px]">
        <DropdownMenuItem>
          <PDFDownloadLink
            document={data}
            fileName={docName + ".pdf"}
            className="flex items-center gap-2"
          >
            <Download />
            Download
          </PDFDownloadLink>
        </DropdownMenuItem>
        {/* <DropdownMenuItem
          onClick={generateWordDocument}
          disabled={!values || true}
        >
          <FileText />
          Microsoft Word &#40;docx&#41;
        </DropdownMenuItem> */}
        <DropdownMenuItem onClick={handleOpenInNewTab}>
          <Printer />
          Print
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
