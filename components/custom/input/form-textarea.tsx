import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";

type FormTextareaType = {
  label: string;
  name: string;
  readonly?: boolean;
  form: UseFormReturn<any>;
};
export default function FormTextarea({
  label,
  name,
  form,
  readonly,
}: FormTextareaType) {
  return (
    <div>
      <label className="text-sm font-medium text">{label}</label>
      <Textarea
        {...form.register(name)}
        rows={5}
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
