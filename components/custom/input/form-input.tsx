import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";

type FormInputType = {
  label: string;
  name: string;
  type?: string;
  readonly?: boolean;
  form: UseFormReturn<any>;
};
export default function FormInput({
  label,
  type,
  name,
  form,
  readonly,
}: FormInputType) {
  return (
    <div>
      <label className="text-sm font-medium text">{label}</label>
      <Input
        {...form.register(name)}
        type={type || "text"}
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
