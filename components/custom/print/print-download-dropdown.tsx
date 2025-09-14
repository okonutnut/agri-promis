"use client";

import { Button } from "@/components/ui/button";
import { pdf } from "@react-pdf/renderer";
import { Printer } from "lucide-react";
import React, { useCallback } from "react";
import { DocumentProps } from "@react-pdf/renderer";

type PrintDownloadDropdownProps = {
  data: React.ReactElement<DocumentProps>;
};

const PrintDownloadDropdown = React.memo(function PrintDownloadDropdown({
  data,
}: PrintDownloadDropdownProps) {
  const handleOpenInNewTab = useCallback(async () => {
    if (!data) return;
    const blob = await pdf(data).toBlob();
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  }, [data]);
  console.log("Rendering PrintDownloadDropdown");

  return (
    <Button
      variant="outline"
      size="sm"
      disabled={!data}
      onClick={handleOpenInNewTab}
    >
      <Printer />
      Print
    </Button>
  );
});

export default PrintDownloadDropdown;
