"use client";

import { Button } from "@/components/ui/button";
import FormInput from "./form-input";
import { UseFormReturn } from "react-hook-form";
import { Label } from "@/components/ui/label";
import FormTextarea from "./form-textarea";
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
  return (
    <div className="relative">
      {readOnly ? (
        <Label>{label}</Label>
      ) : (
        <div className="flex items-center gap-2 m-0">
          <FormTextarea
            label={label}
            name={`${name}.0`}
            form={form}
            readonly={readOnly}
            className="flex-1"
          />
          <Button
            type="button"
            onClick={() => {
              const currentIssues = form.getValues(`${name}`) || [];
              const newIssue = form.getValues(`${name}`)?.[0];
              if (newIssue && newIssue.trim()) {
                form.setValue(`${name}`, [...currentIssues, newIssue.trim()]);
                form.setValue(`${name}.0`, "");
              }
            }}
            disabled={!form.watch(`${name}`)?.[0] || readOnly}
            className="min-h-full min-w-[20px]"
          >
            +
          </Button>
        </div>
      )}
      <table className="w-full overflow-x-auto">
        <tbody>
          {(form.watch(`${name}`) || values)
            ?.slice(1)
            .map((issue: string, index: number) => (
              <tr key={index} className="flex items-center truncate">
                <td>
                  {readOnly ? (
                    <span className="text-sm text-muted-foreground">
                      <Dot />
                    </span>
                  ) : (
                    <Button
                      type="button"
                      variant="secondary"
                      className="text-sm shadow-none text-destructive"
                      onClick={() => {
                        const currentIssues = form.getValues(`${name}`) || [];
                        form.setValue(`${name}`, [
                          currentIssues[0],
                          ...currentIssues
                            .slice(1)
                            .filter((_: string, i: number) => i !== index),
                        ]);
                      }}
                    >
                      ×
                    </Button>
                  )}
                </td>
                <td className="my-auto">
                  <span className="text-sm text-start max-w-sm break-words">
                    {issue}
                  </span>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
