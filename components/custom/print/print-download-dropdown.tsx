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
import React, { useCallback } from "react";
import { DocumentProps } from "@react-pdf/renderer";

type PrintDownloadDropdownProps = {
  data: React.ReactElement<DocumentProps>;
};

const PrintDownloadDropdown = React.memo(function PrintDownloadDropdown({
  data,
}: PrintDownloadDropdownProps) {
  const handleOpenInNewTab = useCallback(async () => {
    const blob = await pdf(data).toBlob();
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  }, [data]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="w-full flex items-center gap-2"
        >
          Export <ChevronDown />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="m-1 w-[--radix-dropdown-menu-trigger-width]">
        <DropdownMenuItem>
          <PDFDownloadLink
            document={data}
            fileName={`da-nves-report-${Date.now()}.pdf`}
            className="flex items-center gap-2"
          >
            <Download />
            Download
          </PDFDownloadLink>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleOpenInNewTab}>
          <Printer />
          Print
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
});

export default PrintDownloadDropdown;
