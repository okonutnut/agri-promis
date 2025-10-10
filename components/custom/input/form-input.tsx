"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

type FormInputType = {
  label: string;
  name: string;
  type?: string;
  readOnly?: boolean;
  disabled?: boolean;
  form: UseFormReturn<any>;
  className?: string;
  copy?: boolean;
  noPlaceholder?: boolean;
};

export default function FormInput({
  label,
  type,
  name,
  form,
  readOnly,
  disabled,
  className,
  copy = false,
  noPlaceholder = false,
}: FormInputType) {
  return (
    <div className={cn("w-full", className)}>
      <Label
        htmlFor={name}
        className="capitalize mb-1 block text-sm font-medium"
      >
        {label}
      </Label>

      <div className="relative">
        <Input
          {...form.register(name)}
          type={type || "text"}
          placeholder={noPlaceholder ? "" : `Enter ${label.toLowerCase()}`}
          disabled={disabled}
          tabIndex={-1}
          readOnly={
            form.formState.isSubmitting ||
            form.formState.isValidating ||
            readOnly
          }
          className={cn(copy ? "pr-10" : "")} // extra space for button
        />

        {copy && (
          <Button
            size="icon"
            type="button"
            variant="outline"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-20 text-xs"
            onClick={() => {
              navigator.clipboard.writeText(form.getValues(name));
              toast.info(`Copied ${label} to clipboard`);
            }}
          >
            COPY
          </Button>
        )}
      </div>

      <span className="text-xs text-red-500">
        {(form.formState.errors[name] as { message?: string })?.message}
      </span>
    </div>
  );
}
