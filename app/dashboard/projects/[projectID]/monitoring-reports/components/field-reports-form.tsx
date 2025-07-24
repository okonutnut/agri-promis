import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import NonFormInput from "@/components/custom/input/non-form-input";
import { Textarea } from "@/components/ui/textarea";
import FormTextarea from "@/components/custom/input/form-textarea";
import { SheetClose, SheetFooter } from "@/components/ui/sheet";
import { useInsertRemarksInMonitoringReportHook } from "@/components/hooks";
import { MonitoringReportType } from "@/components/types";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";
import { useEffect, useRef } from "react";

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
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const form = useForm<FieldTechType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: data?.id || "",
      remarks: data?.remarks || "",
    },
  });

  const { mutate, isPending, isSuccess } =
    useInsertRemarksInMonitoringReportHook(data?.id as string);
  const onSubmit = (data: FieldTechType) => mutate(data);

  useEffect(() => {
    if (isSuccess) {
      form.reset();
      closeButtonRef.current?.click();
    }
  }, [isSuccess, form]);

  return (
    <>
      {data?.created_at && (
        <span className="italic text-xs text-muted-foreground mx-2">
          Date Submitted: {format(new Date(data.created_at), "PPp")}
        </span>
      )}
      <form
        className="p-3 space-y-4"
        id="remarks-form"
        onSubmit={form.handleSubmit(onSubmit)}
      >
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
      </form>
      <SheetFooter className="border-t ">
        {!data?.remarks && (
          <Button
            form="remarks-form"
            variant={isPending ? "ghost" : "default"}
            size={"sm"}
            disabled={isPending}
          >
            {isPending ? <Loader2 className="animate-spin" /> : "Save"}
          </Button>
        )}
        <SheetClose asChild>
          <Button
            variant="outline"
            ref={closeButtonRef}
            size={"sm"}
            className="w-full"
          >
            Close
          </Button>
        </SheetClose>
      </SheetFooter>
    </>
  );
}
