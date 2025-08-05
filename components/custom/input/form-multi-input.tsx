"use client";

import { Button } from "@/components/ui/button";
import FormInput from "./form-input";
import { UseFormReturn } from "react-hook-form";
import { Label } from "@/components/ui/label";

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
    <div className="space-y-2 relative">
      {!readOnly ? (
        <div className="flex items-end gap-2">
          <FormInput
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
            className="mb-[1.5px] min-w-[20px]"
          >
            +
          </Button>
        </div>
      ) : (
        <Label>{label}</Label>
      )}
      <table className="w-full overflow-x-auto border">
        <tbody>
          {(form.watch(`${name}`) || values)
            ?.slice(1)
            .map((issue: string, index: number) => (
              <tr
                key={index}
                className="flex items-center gap-1 py-1 truncate border-b"
              >
                <td>
                  {!readOnly && (
                    <Button
                      type="button"
                      variant="ghost"
                      className="text-sm hover:text-destructive"
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
                <td className="flex-1 gap-2">
                  <span className="text-sm text-start">{issue}</span>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
