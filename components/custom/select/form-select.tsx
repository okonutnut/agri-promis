"use client";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { Controller, UseFormReturn } from "react-hook-form";

type FormSelectProps = {
  label: string;
  name: string;
  options: { value: any; label: string }[];
  form: UseFormReturn<any>;
  onClick?: () => void;
  isLoading?: boolean;
};
export default function FormSelect({
  label,
  name,
  options,
  form,
  onClick,
  isLoading,
}: FormSelectProps) {
  return (
    <div>
      {label && (
        <Label className="capitalize mb-1 block text-sm font-semibold">
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
              {isLoading ? (
                <SelectItem value="loading">
                  <Loader2 className="animate-spin" />
                </SelectItem>
              ) : (
                options.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value.toString()}
                    onClick={onClick}
                  >
                    {option.label}
                  </SelectItem>
                ))
              )}
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
