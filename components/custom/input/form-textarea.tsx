import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { UseFormReturn } from "react-hook-form";

type FormTextareaType = {
  label: string;
  name: string;
  readonly?: boolean;
  form: UseFormReturn<any>;
  className?: string;
};
export default function FormTextarea({
  label,
  name,
  form,
  readonly,
  className,
}: FormTextareaType) {
  return (
    <div className={cn(`w-full mt-2 mb-4`, className)}>
      <Label htmlFor={name} className="font-medium mb-1">
        {label}
      </Label>
      <Textarea
        {...form.register(name)}
        id={name}
        rows={5}
        tabIndex={-1}
        placeholder={`Enter ${label.toLowerCase()}`}
        readOnly={
          form.formState.isSubmitting || form.formState.isValidating || readonly
        }
      />
      <p className="text-red-500 text-xs">
        {(form.formState.errors[name] as { message?: string })?.message}
      </p>
    </div>
  );
}
