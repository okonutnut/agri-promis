import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { ClipboardIcon } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

type FormInputType = {
  label: string;
  name: string;
  type?: string;
  readonly?: boolean;
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
  readonly,
  disabled,
  className,
  copy = false,
  noPlaceholder = false,
}: FormInputType) {
  return (
    <div className={cn(`w-full`, className)}>
      <div className="text-sm font-medium flex justify-between items-center mb-1">
        <Label htmlFor={name} className="capitalize">
          {label}
        </Label>
        {copy && (
          <Button
            size={"sm"}
            type="button"
            variant="ghost"
            onClick={() => {
              if (copy) {
                navigator.clipboard.writeText(form.getValues(name));
                toast.info(`Copied ${label} to clipboard`);
              }
            }}
          >
            <ClipboardIcon />
          </Button>
        )}
      </div>
      <Input
        {...form.register(name)}
        type={type || "text"}
        placeholder={noPlaceholder ? "" : `Enter ${label.toLowerCase()}`}
        disabled={disabled}
        tabIndex={-1}
        readOnly={
          form.formState.isSubmitting || form.formState.isValidating || readonly
        }
      />
      <span className="text-xs text-red-500">
        {(form.formState.errors[name] as { message?: string })?.message}
      </span>
    </div>
  );
}
