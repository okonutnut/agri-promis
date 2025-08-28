"use client";

import { Label } from "@/components/ui/label";
import { Dot } from "lucide-react";

type FormMultiInputProps = {
  label: string;
  values?: any | null;
};

export default function FormMultiInput({ values, label }: FormMultiInputProps) {
  return (
    <div className="space-y-2 relative">
      <Label>{label}</Label>
      <ul>
        {values?.map((issue: string, index: number) => (
          <li key={index} className="flex items-start gap-1 mb-1">
            <span className="text-sm text-muted-foreground flex-shrink-0 mt-0.5">
              <Dot />
            </span>
            <span className="text-sm break-words flex-1 leading-relaxed">
              {issue}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
