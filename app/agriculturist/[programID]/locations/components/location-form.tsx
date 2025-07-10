import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { InsertLocationHook } from "../hook";
import FormInput from "@/components/custom/input/form-input";
import { useEffect } from "react";

const formSchema = z.object({
  id: z.string().optional(),
  province: z.string().min(1, "Province is required"),
  municipality: z.string().min(1, "Municipality is required"),
  barangay: z.string().min(1, "Barangay is required"),
});

type LocationType = z.infer<typeof formSchema>;

type LocationPageFormProps = {
  selectedRow?: LocationType | null;
};
export default function LocationPageForm({
  selectedRow,
}: LocationPageFormProps) {
  const form = useForm<LocationType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: selectedRow?.id || "",
      province: selectedRow?.province || "",
      municipality: selectedRow?.municipality || "",
      barangay: selectedRow?.barangay || "",
    },
  });

  const { mutate, isPending, isSuccess } = InsertLocationHook();
  const onSubmit = (data: LocationType) => mutate(data);

  useEffect(() => {
    if (isSuccess) {
      form.reset();
    }
  }, [isSuccess]);

  return (
    <form className="p-3 space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
      {selectedRow && <FormInput label="ID" name="id" form={form} readonly />}
      <FormInput label="Province" name="province" form={form} />
      <FormInput label="Municipality" name="municipality" form={form} />
      <FormInput label="Barangay" name="barangay" form={form} />
      <div className="flex gap-2 justify-end">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Please wait..." : selectedRow ? "Update" : "Add"}
        </Button>
      </div>
    </form>
  );
}
