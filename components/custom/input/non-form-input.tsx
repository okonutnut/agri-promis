"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { ClipboardIcon } from "lucide-react";
import { toast } from "sonner";

type NonFormInputType = {
  label: string;
  defaultValue?: string;
  readOnly?: boolean;
  disabled?: boolean;
  className?: string;
  copy?: boolean;
};
export default function NonFormInput({
  label,
  defaultValue,
  readOnly,
  disabled,
  className,
  copy = false,
}: NonFormInputType) {
  return (
    <div className={cn(`w-full`, className)}>
      <div className="text-sm font-medium flex justify-between items-center mb-1">
        <Label className="capitalized">{label}</Label>
        {copy && (
          <Button
            size={"sm"}
            type="button"
            variant="ghost"
            onClick={() => {
              if (copy) {
                navigator.clipboard.writeText(defaultValue || "");
                toast.info(`Copied ${label} to clipboard`, {
                  position: "bottom-right",
                  duration: 2000,
                });
              }
            }}
          >
            <ClipboardIcon />
          </Button>
        )}
      </div>
      <Input
        placeholder={`Enter ${label.toLowerCase()}`}
        defaultValue={defaultValue}
        disabled={disabled}
        readOnly={readOnly}
        autoFocus={false}
        tabIndex={-1}
      />
    </div>
  );
}
