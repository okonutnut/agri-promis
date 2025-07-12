import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";

export default function FormSelect({
  label,
  name,
  options,
  form,
  defaultValue,
  placeholder = "Select an option",
  onClick,
}: {
  label: string;
  name: string;
  options: { value: string; label: string }[];
  form: UseFormReturn<any>;
  defaultValue?: string;
  placeholder?: string;
  onClick?: () => void;
}) {
  return (
    <div>
      {label && (
        <div className="text-xs font-medium text flex justify-between items-center mb-1">
          {label}
        </div>
      )}
      <Select onValueChange={(value) => form.setValue(name, value)}>
        <SelectTrigger className="w-full">
          <SelectValue
            defaultValue={options.find((o) => o.value === defaultValue)?.value}
          />
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
