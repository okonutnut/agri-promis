"use client";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type NonFormTextareaType = {
  label: string;
  readonly?: boolean;
  className?: string;
  rows?: number;
  noPlaceholder?: boolean;
  defaultValue?: string;
};
export default function NonFormTextarea({
  label,
  readonly,
  className,
  defaultValue,
  rows = 5,
  noPlaceholder = false,
}: NonFormTextareaType) {
  return (
    <div className={cn(`w-full mt-2 mb-4`, className)}>
      <Label className="font-medium mb-1">{label}</Label>
      <Textarea
        defaultValue={defaultValue}
        rows={rows || 7}
        tabIndex={-1}
        placeholder={noPlaceholder ? undefined : `Enter ${label.toLowerCase()}`}
        readOnly={readonly}
      />
    </div>
  );
}
