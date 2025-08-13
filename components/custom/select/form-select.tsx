"use client";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Controller, UseFormReturn } from "react-hook-form";

type FormSelectProps = {
  label: string;
  name: string;
  options: { value: any; label: string }[];
  form: UseFormReturn<any>;
  onClick?: () => void;
};
export default function FormSelect({
  label,
  name,
  options,
  form,
  onClick,
}: FormSelectProps) {
  return (
    <div>
      {label && (
        <Label className="text-sm font-medium text flex justify-between items-center mb-1">
          {label}
        </Label>
      )}
      <Controller
        control={form.control}
        name={name}
        render={({ field }) => (
          <Select
            value={field.value?.toString()}
            onValueChange={(value) => field.onChange(value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value.toString()}
                  onClick={onClick}
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
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
