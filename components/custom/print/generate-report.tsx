"use client";

import { Button } from "@/components/ui/button";
import { pdf } from "@react-pdf/renderer";
import { Download } from "lucide-react";

type GenerateReportProps = {
  data: React.ReactElement<import("@react-pdf/renderer").DocumentProps>;
  btnName?: string;
};

export default function GenerateReport({ data, btnName }: GenerateReportProps) {
  const handleOpenInNewTab = async () => {
    const blob = await pdf(data).toBlob(); // Generate the PDF as a Blob
    const url = URL.createObjectURL(blob); // Create a URL for the Blob
    window.open(url, "_blank"); // Open the URL in a new tab
  };

  return (
    <Button
      variant="ghost"
      size={"sm"}
      className="flex items-center gap-2"
      onClick={handleOpenInNewTab}
    >
      {btnName ?? "Export"} <Download />
    </Button>
  );
}
