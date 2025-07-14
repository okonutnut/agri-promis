import FormTextarea from "@/components/custom/input/form-textarea";
import { useInsertFieldReportHook } from "@/components/hooks";
import { FieldReportType } from "@/components/types";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";

interface UploadFieldReportFormProps {
  image_file: File | undefined;
  location?: {
    latitude: number | undefined;
    longitude: number | undefined;
    error: string | undefined;
  };
}

export default function UploadFieldReportForm({
  image_file,
  location,
}: UploadFieldReportFormProps) {
  const form = useForm();

  const { mutate, isPending } = useInsertFieldReportHook();
  const onSubmit = (data: FieldReportType) => {
    console.log({
      ...data,
      image_file,
      latitude: location?.latitude,
      longitude: location?.longitude,
    });
    mutate({
      ...data,
      image_file,
      latitude: location?.latitude,
      longitude: location?.longitude,
    });
  };
  return (
    <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
      <FormTextarea label="Status Note" name="status_note" form={form} />
      <Button variant={isPending ? "ghost" : "default"}>
        {isPending ? "Submitting..." : "Submit Report"}
      </Button>
    </form>
  );
}
