import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";

type FormSelectProps = {
  label: string;
  name: string;
  options: { value: string; label: string }[];
  form: UseFormReturn<any>;
  defaultValue?: string;
  onClick?: () => void;
};
export default function FormSelect({
  label,
  name,
  options,
  form,
  defaultValue,
  onClick,
}: FormSelectProps) {
  return (
    <div>
      {label && (
        <div className="text-xs font-medium text flex justify-between items-center mb-1">
          {label}
        </div>
      )}
      <Select
        defaultValue={defaultValue}
        onValueChange={(value) => form.setValue(name, value)}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              onClick={onClick}
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {form.formState.errors[name] && (
        <p className="text-xs text-red-500 mt-1">
          {typeof form.formState.errors[name]?.message === "string"
            ? form.formState.errors[name]?.message
            : ""}
        </p>
      )}
    </div>
  );
}
