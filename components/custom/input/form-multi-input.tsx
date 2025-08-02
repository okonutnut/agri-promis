import { Badge } from "@/components/ui/badge";
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
    <div className="space-y-2">
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
      <div className="flex flex-wrap gap-2">
        {(form.watch(`${name}`) || values)
          ?.slice(1)
          .map((issue: string, index: number) => (
            <Badge
              key={index}
              variant={"outline"}
              className="flex items-center gap-1 bg-secondary rounded-full px-3 py-1"
            >
              <span className="text-sm">{issue}</span>
              {!readOnly && (
                <button
                  type="button"
                  className="text-sm hover:text-destructive"
                  onClick={() => {
                    const currentIssues = form.getValues("issues_concern");
                    form.setValue("issues_concern", [
                      currentIssues[0],
                      ...currentIssues
                        .slice(1)
                        .filter((_: string, i: number) => i !== index),
                    ]);
                  }}
                >
                  ×
                </button>
              )}
            </Badge>
          ))}
      </div>
    </div>
  );
}
