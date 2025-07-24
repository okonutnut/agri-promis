import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import NonFormInput from "@/components/custom/input/non-form-input";
import { Textarea } from "@/components/ui/textarea";
import FormTextarea from "@/components/custom/input/form-textarea";
import { SheetClose } from "@/components/ui/sheet";
import { useInsertRemarksInMonitoringReportHook } from "@/components/hooks";
import { MonitoringReportType } from "@/components/types";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  id: z.string().min(1, "ID is required"),
  remarks: z
    .string()
    .min(1, "Remarks is required")
    .max(500, "Remarks cannot exceed 500 characters"),
});

type FieldTechType = z.infer<typeof formSchema>;

type FieldReportsFormProps = {
  data: MonitoringReportType | null;
};
export function FieldReportsForm({ data }: FieldReportsFormProps) {
  const form = useForm<FieldTechType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: data?.id || "",
      remarks: data?.remarks || "",
    },
  });

  const { mutate, isPending } = useInsertRemarksInMonitoringReportHook(
    data?.id as string
  );
  const onSubmit = (data: FieldTechType) => mutate(data);

  return (
    <>
      <form className="p-3 space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <NonFormInput
          label="Reporter Name"
          defaultValue={data?.reporter?.fullname}
          readonly
        />
        <div className="text-xs font-medium text flex justify-between items-center mb-1">
          Status note
        </div>
        <Textarea value={data?.status_note} readOnly tabIndex={-1} />
        <FormTextarea
          label="Remarks"
          name="remarks"
          form={form}
          readonly={data?.remarks ? true : false}
        />
        <div className="flex gap-2 justify-end">
          <SheetClose asChild>
            <Button variant="outline" size={"sm"} type="button">
              Close
            </Button>
          </SheetClose>
          {!data?.remarks && (
            <Button
              type="submit"
              variant={isPending ? "ghost" : "default"}
              size={"sm"}
              disabled={isPending}
            >
              {isPending ? <Loader2 className="animate-spin" /> : "Save"}
            </Button>
          )}
        </div>
      </form>
    </>
  );
}
