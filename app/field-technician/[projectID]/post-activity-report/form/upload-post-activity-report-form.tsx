import FormTextarea from "@/components/custom/input/form-textarea";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useParams } from "next/navigation";
import FormInput from "@/components/custom/input/form-input";

const formSchema = z.object({
  travel_order_no: z
    .string()
    .min(1, "Travel Order No. is required")
    .min(5, "Travel Order No. must be at least 5 characters")
    .max(500, "Travel Order No. must not exceed 500 characters"),
});

type formData = z.infer<typeof formSchema>;

export default function UploadPostActivityReportForm() {
  const { projectID } = useParams();
  const form = useForm<formData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      travel_order_no: "",
    },
  });

  const onSubmit = (data: formData) => console.log(data);

  return (
    <form
      className="overflow-y-auto p-2"
      id="upload-post-activity-report-form"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <FormInput form={form} label="Travel Order No." name="travel_order_no" />
    </form>
  );
}
