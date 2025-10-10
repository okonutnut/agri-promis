"use client";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { UseFormReturn } from "react-hook-form";

type FormTextareaType = {
  label: string;
  name: string;
  readOnly?: boolean;
  form: UseFormReturn<any>;
  className?: string;
  optinal?: boolean;
  rows?: number;
  noPlaceholder?: boolean;
};
export default function FormTextarea({
  label,
  name,
  form,
  readOnly,
  className,
  optinal,
  rows = 5,
  noPlaceholder = false,
}: FormTextareaType) {
  return (
    <div className={cn(`w-full mt-2 mb-4`, className)}>
      <Label htmlFor={name} className="font-medium mb-1">
        {label} {optinal && <span className="text-gray-500">(optional)</span>}
      </Label>
      <Textarea
        {...form.register(name)}
        id={name}
        rows={rows || 7}
        tabIndex={-1}
        placeholder={noPlaceholder ? undefined : `Enter ${label.toLowerCase()}`}
        readOnly={
          form.formState.isSubmitting || form.formState.isValidating || readOnly
        }
      />
      <p className="text-red-500 text-xs">
        {(form.formState.errors[name] as { message?: string })?.message}
      </p>
    </div>
  );
}
