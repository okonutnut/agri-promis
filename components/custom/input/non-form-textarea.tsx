"use client";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type NonFormTextareaType = {
  label: string;
  className?: string;
  rows?: number;
  noPlaceholder?: boolean;
  readOnly?: boolean; // Added readOnly property
  props?: React.TextareaHTMLAttributes<HTMLTextAreaElement>;
};

export default function NonFormTextarea({
  label,
  className,
  rows = 5,
  noPlaceholder = false,
  ...props
}: NonFormTextareaType) {
  return (
    <div className={cn(`w-full mt-2 mb-4`, className)}>
      <Label className="capitalize mb-1 block text-sm font-semibold">
        {label}
      </Label>
      <Textarea
        rows={rows || 7}
        tabIndex={-1}
        placeholder={noPlaceholder ? undefined : `Enter ${label.toLowerCase()}`}
        {...props}
      />
    </div>
  );
}
