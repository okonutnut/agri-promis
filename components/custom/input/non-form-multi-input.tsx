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
      <ul className="list-disc">
        {values?.slice(1).map((issue: string, index: number) => (
          <li key={index} className="flex items-start gap-2">
            <Dot />
            <span className="text-sm text-start break-words">{issue}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
