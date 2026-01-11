"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { ClipboardIcon } from "lucide-react";
import { toast } from "sonner";

type NonFormInputType = {
  label: string;
  className?: string;
  copy?: boolean;
} & React.InputHTMLAttributes<HTMLInputElement>;

export default function NonFormInput({
  label,
  className,
  copy = false,
  ...props
}: NonFormInputType) {
  return (
    <div className={cn(`w-full`, className)}>
      <div className="text-sm font-medium flex justify-between items-center mb-1">
        <Label className="capitalize mb-1 block text-sm font-semibold">
          {label}
        </Label>
        {copy && (
          <Button
            size={"sm"}
            type="button"
            variant="ghost"
            onClick={() => {
              if (copy) {
                navigator.clipboard.writeText(
                  props.defaultValue?.toString() || ""
                );
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
        autoFocus={false}
        tabIndex={-1}
        {...props}
      />
    </div>
  );
}
