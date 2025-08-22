'use client";';

import dynamic from "next/dynamic";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEditProjectHook } from "@/components/hooks";
import { CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { ProjectType } from "@/components/types";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
const FCASelector = dynamic(
  () => import("@/components/custom/dropdown/fca-selector"),
  {
    ssr: false,
  }
);
const FormInput = dynamic(
  () => import("@/components/custom/input/form-input"),
  {
    ssr: false,
  }
);

const formSchema = z.object({
  id: z.string().min(1, "Project ID is required"),
  project_name: z.string().min(1, "Project name is required"),
  fca_ids: z.array(z.string()).min(1, "FCA is required"),
  status: z
    .number()
    .refine(
      (val) => [0, 1].includes(val),
      "Status must be either 0 (inactive) or 1 (active)"
    ),
});
type FormSchemaType = z.infer<typeof formSchema>;

type EditProjectNameFormProps = {
  project: ProjectType;
};
export default function EditProjectNameForm({
  project,
}: EditProjectNameFormProps) {
  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: project.id as string,
      project_name: project.project_name || "",
      fca_ids: project.fca_ids || [],
      status: project.status || 0,
    },
  });

  const { mutate, isPending } = useEditProjectHook();
  const handleSubmit = (data: FormSchemaType) => mutate(data);

  return (
    <>
      <form
        className="w-full flex flex-col items-start space-y-6"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <FormInput label="Project ID" name="id" form={form} readonly copy />
        <FormInput label="Project name" name="project_name" form={form} />
        <FCASelector
          onChange={(value) => form.setValue("fca_ids", value)}
          defaultValue={project.fca_ids || []}
        />
        <div className="w-full flex justify-between items-center">
          <Label>Set Active</Label>
          <Switch
            checked={form.watch("status") === 1}
            onCheckedChange={(checked) =>
              form.setValue("status", checked ? 1 : 0)
            }
          />
        </div>
        <CardFooter className="w-full justify-end p-0">
          <Button
            type="submit"
            size={"sm"}
            variant={isPending ? "ghost" : "default"}
            disabled={isPending}
          >
            {isPending ? <Loader2 className="animate-spin" /> : "Save Changes"}
          </Button>
        </CardFooter>
      </form>
    </>
  );
}
