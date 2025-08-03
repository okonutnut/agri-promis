// components/PrintableComponent.tsx
"use client";

import { MonitoringReportType } from "@/components/types";
import Image from "next/image";
import { forwardRef } from "react";

interface Props {
  data: MonitoringReportType | null;
}

const MonitoringTemplate = forwardRef<HTMLDivElement, Props>(
  ({ data }, ref) => {
    return (
      <div ref={ref} className="p-4 print-only font-times-new-roman relative">
        <h1 className="text-xl font-bold text-center mb-4">
          Monitoring Report
        </h1>
        <h1 className="text-md font-bold mb-3">Findings</h1>
        <ul className="list-disc pl-6">
          {data?.findings
            ?.filter((finding) => finding && finding.trim() !== "")
            ?.map((finding) => (
              <li key={finding}>
                <p>{finding}</p>
              </li>
            ))}
        </ul>
        <br />
        <br />
        <h1 className="text-md font-bold mb-3">Observations</h1>
        <p>{data?.observation}</p>
        <br />
        <br />
        <h1 className="text-md font-bold mb-3">Issues and Concerns</h1>
        <p>{data?.issues_concern}</p>
        <br />
        <br />
        <h1 className="text-md font-bold mb-3">Remarks</h1>
        <p>{data?.remarks ?? ""}</p>
        <br />
        <br />
        <h1 className="text-md font-bold mb-3">Photo Documentation</h1>
        <div className="grid grid-cols-2 gap-2 w-full">
          {data?.photo_url?.map((photo, index) => (
            <div key={index} className="aspect-square w-full">
              <Image
                src={photo}
                alt={`Photo ${index + 1}`}
                className="w-full h-full object-cover"
                width={100}
                height={100}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }
);

MonitoringTemplate.displayName = "MonitoringTemplate"; // Required for ESLint
export default MonitoringTemplate;
