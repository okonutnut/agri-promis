"use client";

import { Button } from "@/components/ui/button";
import { pdf } from "@react-pdf/renderer";
import { Download, Printer, Loader2 } from "lucide-react";
import { useState } from "react";
import type { DocumentProps } from "@react-pdf/renderer";

type ButtonVariant =
  | "default"
  | "outline"
  | "ghost"
  | "link"
  | "destructive"
  | "secondary";

type PrintDownloadButtonProps = {
  document: React.ReactElement<DocumentProps>;
  fileNamePrefix?: string;
  printBtnName?: string;
  variant?: ButtonVariant;
  size?: "default" | "sm" | "lg" | "icon";
  disabled?: boolean;
};

export default function PrintDownloadButton({
  document: doc,
  fileNamePrefix = "document",
  printBtnName = "Print",
  variant = "outline",
  size = "sm",
  disabled: externalDisabled = false,
}: PrintDownloadButtonProps) {
  const [isPrinting, setIsPrinting] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const buildFileName = () => `${fileNamePrefix}-${Date.now()}.pdf`;

  const handlePrint = async () => {
    setIsPrinting(true);
    try {
      const blob = await pdf(doc).toBlob();
      const url = URL.createObjectURL(blob);
      const newWindow = window.open(url, "_blank");
      if (
        !newWindow ||
        newWindow.closed ||
        typeof newWindow.closed === "undefined"
      ) {
        const link = window.document.createElement("a");
        link.href = url;
        link.download = buildFileName();
        window.document.body.appendChild(link);
        link.click();
        window.document.body.removeChild(link);
      }
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (err) {
      console.error("Error generating PDF:", err);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsPrinting(false);
    }
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const blob = await pdf(doc).toBlob();
      const url = URL.createObjectURL(blob);
      const link = window.document.createElement("a");
      link.href = url;
      link.download = buildFileName();
      window.document.body.appendChild(link);
      link.click();
      window.document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (err) {
      console.error("Error downloading PDF:", err);
      alert("Failed to download PDF. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  const disabled = isPrinting || isDownloading || externalDisabled;

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
            {printBtnName} <Printer />
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
