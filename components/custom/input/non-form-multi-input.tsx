"use client";

import { Label } from "@/components/ui/label";
import { Dot } from "lucide-react";

type NonFormMultiInputProps = {
  label: string;
  values?: any | null;
};

export default function NonFormMultiInput({
  values,
  label,
}: NonFormMultiInputProps) {
  return (
    <div className="space-y-2 relative">
      <Label className="capitalize mb-1 block text-sm font-semibold">
        {label}
      </Label>
      <ul>
        {values && values.length > 0 ? (
          values.map((issue: string, index: number) => (
            <li key={index} className="flex items-start gap-1 mb-1">
              <span className="text-sm text-muted-foreground flex-shrink-0 mt-0.5">
                <Dot />
              </span>
              <span className="text-sm break-words flex-1 leading-relaxed">
                {issue}
              </span>
            </li>
          ))
        ) : (
          <li className="text-sm text-muted-foreground italic">N/A</li>
        )}
      </ul>
    </div>
  );
}
