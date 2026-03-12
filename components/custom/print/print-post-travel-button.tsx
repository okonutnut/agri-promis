"use client";

import PostTravelReactPDF from "@/components/print-templates/post-travel-react-pdf";
import { PostTravelWithDetails } from "@/app/types";
import { useQuery } from "@tanstack/react-query";
import { SelectSettings } from "@/app/actions/SystemSettingsAction";
import { PostTravelPrintSettingsType } from "@/app/dashboard/settings/components/postTravelPrint";
import PrintDownloadButton from "@/components/custom/print/print-download-button";

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
  const projectTitle = data.project_title_activity || "";
  const iccFcaLguName = data.icc_fca_lgu_name || "";

  const {
    data: printSettings,
    isLoading,
    error,
  } = useQuery<PostTravelPrintSettingsType>({
    queryFn: async () => await SelectSettings("travel_report_print_settings"),
    queryKey: ["travel_report_print_settings"],
  });

  return (
    <PrintDownloadButton
      document={
        <PostTravelReactPDF
          data={data}
          printSettings={printSettings}
          projectTitle={projectTitle}
          iccFcaLguName={iccFcaLguName}
        />
      }
      fileNamePrefix="post-travel-report"
      printBtnName={btnName}
      variant={variant}
      size={size}
      disabled={isLoading || !!error}
    />
  );
}
