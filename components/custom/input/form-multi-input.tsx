"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { UseFormReturn } from "react-hook-form";
import { Dot } from "lucide-react";

type FormMultiInputProps = {
  label: string;
  name: string;
  form: UseFormReturn<any>;
  values?: any | null;
  readOnly?: boolean;
};

export default function FormMultiInput({
  form,
  values,
  label,
  name,
  readOnly,
}: FormMultiInputProps) {
  const currentValues = form.watch(name) || [];

  return (
    <div className="relative space-y-2">
      {readOnly ? (
        <Label>{label}</Label>
      ) : (
        <div className="flex items-center gap-2 m-0">
          <div className="flex-1 space-y-2">
            <Label htmlFor={`${name}-input`}>{label}</Label>
            <Textarea
              id={`${name}-input`}
              placeholder={`Enter ${label.toLowerCase()}...`}
              value={currentValues[0] || ""}
              onChange={(e) => {
                const existingValues = form.getValues(name) || [];
                form.setValue(name, [
                  e.target.value,
                  ...existingValues.slice(1),
                ]);
              }}
              disabled={readOnly}
              className="resize-none"
              rows={3}
            />
          </div>
          <Button
            type="button"
            onClick={() => {
              const existingValues = form.getValues(name) || [];
              const newValue = existingValues[0];
              if (newValue && newValue.trim()) {
                // Add the new value to the list and clear the input
                const updatedValues = [
                  "", // Clear the input
                  ...existingValues.slice(1), // Keep existing saved items
                  newValue.trim(), // Add the new item
                ];
                form.setValue(name, updatedValues);
              }
            }}
            disabled={!currentValues[0]?.trim() || readOnly}
            className="min-h-[40px] min-w-[40px] self-end"
          >
            +
          </Button>
        </div>
      )}
      <ul className="max-w-md my-1">
        {(readOnly ? values : currentValues.slice(1)) // Only show saved items (skip index 0 which is the input)
          ?.filter(Boolean) // Filter out empty strings
          ?.map((item: string, index: number) => (
            <li key={index} className="flex items-start gap-2 my-2">
              {readOnly ? (
                <span className="text-sm text-muted-foreground flex-shrink-0 mt-0.5">
                  <Dot />
                </span>
              ) : (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-sm shadow-none text-destructive flex-shrink-0 h-6 w-6 p-0"
                  onClick={() => {
                    const existingValues = form.getValues(name) || [];
                    const filteredValues = [
                      existingValues[0], // Keep the input value
                      ...existingValues
                        .slice(1)
                        .filter((_: string, i: number) => i !== index),
                    ];
                    form.setValue(name, filteredValues);
                  }}
                >
                  ×
                </Button>
              )}
              <span className="text-sm break-words flex-1 leading-relaxed">
                {item}
              </span>
            </li>
          ))}
      </ul>
    </div>
  );
}
