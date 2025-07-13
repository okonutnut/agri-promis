import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ClipboardIcon } from "lucide-react";
import { toast } from "sonner";

type NonFormInputType = {
  label: string;
  defaultValue?: string;
  readonly?: boolean;
  disabled?: boolean;
  className?: string;
  copy?: boolean;
};
export default function NonFormInput({
  label,
  defaultValue,
  readonly,
  disabled,
  className,
  copy = false,
}: NonFormInputType) {
  return (
    <div className={cn(`w-full`, className)}>
      <div className="text-xs font-medium text flex justify-between items-center mb-1">
        {label}
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
        readOnly={readonly}
      />
    </div>
  );
}
