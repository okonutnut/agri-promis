"use client";

import { Label } from "@/components/ui/label";

type FormMultiInputProps = {
  label: string;
  values?: any | null;
};
export default function FormMultiInput({ values, label }: FormMultiInputProps) {
  return (
    <div className="space-y-2 relative">
      <Label>{label}</Label>
      <table className="w-full overflow-x-auto border">
        <tbody>
          {values?.slice(1).map((issue: string, index: number) => (
            <tr
              key={index}
              className="flex items-center gap-1 py-1 ps-3 truncate border-b"
            >
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
