"use client";

import { Button } from "@/components/ui/button";
import { pdf } from "@react-pdf/renderer";
import { Download, Printer, Loader2 } from "lucide-react";
import { useState } from "react";
import PostTravelReactPDF from "./post-travel-react-pdf";
import { PostTravelWithDetails } from "@/app/types";

type PrintPostTravelButtonProps = {
  data: PostTravelWithDetails;
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

export default function PrintPostTravelButton({
  data,
  btnName = "Print",
  variant = "outline",
  size = "sm",
}: PrintPostTravelButtonProps) {
  const [isPrinting, setIsPrinting] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const handlePrint = async () => {
    setIsPrinting(true);
    try {
      const blob = await pdf(<PostTravelReactPDF data={data} />).toBlob();
      const url = URL.createObjectURL(blob);

      // Try to open in new window
      const newWindow = window.open(url, "_blank");

      if (
        !newWindow ||
        newWindow.closed ||
        typeof newWindow.closed === "undefined"
      ) {
        // Popup blocked - fallback to download
        const link = document.createElement("a");
        link.href = url;
        link.download = `post-travel-report-${Date.now()}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      // Clean up blob URL after a delay
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
      const blob = await pdf(<PostTravelReactPDF data={data} />).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `post-travel-report-${Date.now()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up blob URL after a delay
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

  return (
    <div className="flex items-center gap-2">
      <Button
        variant={variant}
        size={size}
        className="flex items-center gap-2"
        onClick={handlePrint}
        disabled={isPrinting || isDownloading}
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
        disabled={isPrinting || isDownloading}
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
