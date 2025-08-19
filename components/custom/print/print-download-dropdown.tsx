"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PDFDownloadLink, pdf } from "@react-pdf/renderer";
import { Download, EllipsisVertical, Printer } from "lucide-react";

type PrintDownloadDropdownProps = {
  data: React.ReactElement<import("@react-pdf/renderer").DocumentProps>;
};

export default function PrintDownloadDropdown({
  data,
}: PrintDownloadDropdownProps) {
  const handleOpenInNewTab = async () => {
    const blob = await pdf(data).toBlob(); // Generate the PDF as a Blob
    const url = URL.createObjectURL(blob); // Create a URL for the Blob
    window.open(url, "_blank"); // Open the URL in a new tab
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="mr-2">
        <EllipsisVertical className="w-4 h-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="m-1">
        <DropdownMenuItem>
          <PDFDownloadLink
            document={data}
            fileName={`monitoring-report-${Date.now()}.pdf`}
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
}
