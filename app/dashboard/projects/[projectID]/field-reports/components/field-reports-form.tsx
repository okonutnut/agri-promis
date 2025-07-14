import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import FormInput from "@/components/custom/input/form-input";
import { FieldReportType } from "@/components/types";
import NonFormInput from "@/components/custom/input/non-form-input";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  id: z.string().optional(),
  remarks: z.string().min(1, "Remarks is required"),
});

type FieldTechType = z.infer<typeof formSchema>;

type FieldReportsFormProps = {
  data: FieldReportType | null;
};
export function FieldReportsForm({ data }: FieldReportsFormProps) {
  const form = useForm<FieldTechType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: data?.id || "",
      remarks: data?.remarks || "",
    },
  });

  // const { mutate, isPending } = InsertFieldReportsHook();
  const onSubmit = (data: FieldTechType) => console.log(data);

  return (
    <>
      <form className="p-3 space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="text-xs font-medium text flex justify-between items-center mb-1">
          Status note
        </div>
        <Textarea value={data?.status_note} readOnly />
        <FormInput label="ID" name="id" form={form} readonly />
        <NonFormInput label="Reporter ID" defaultValue={data?.reporter_id} />
        <FormInput label="Remarks" name="remarks" form={form} />
        <div className="flex gap-2 justify-end">
          <Button type="submit">Save</Button>
        </div>
      </form>
    </>
  );
}
