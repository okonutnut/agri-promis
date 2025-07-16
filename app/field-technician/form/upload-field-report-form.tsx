import FormTextarea from "@/components/custom/input/form-textarea";
import { useInsertFieldReportHook } from "@/components/hooks";
import { FieldReportType } from "@/components/types";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";

interface UploadFieldReportFormProps {
  image_file: File | undefined;
  date_time_captured: string;
  location?: {
    latitude: number | undefined;
    longitude: number | undefined;
    error: string | undefined;
    locationName?: string | undefined;
  };
}

export default function UploadFieldReportForm({
  image_file,
  date_time_captured,
  location,
}: UploadFieldReportFormProps) {
  const form = useForm();

  const { mutate, isPending } = useInsertFieldReportHook();
  const onSubmit = (data: FieldReportType) => {
    console.log({
      ...data,
      date_time_captured: date_time_captured,
      image_file,
      location_name: location?.locationName,
      latitude: location?.latitude,
      longitude: location?.longitude,
    });
    mutate({
      ...data,
      date_time_captured: date_time_captured,
      image_file,
      location_name: location?.locationName,
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
