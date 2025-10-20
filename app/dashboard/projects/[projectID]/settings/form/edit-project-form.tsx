"use client";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import cornGrowthStages from "@/data/growth-stages.json";
import FormInput from "@/components/custom/input/form-input";
import { useModal } from "@/components/custom/layout/custom-page-layout";
import FormTextarea from "@/components/custom/input/form-textarea";
import FCASelector from "@/components/custom/dropdown/fca-selector";

const formSchema = z.object({
  id: z.string().min(1, "Project ID is required"),
  project_name: z.string().min(1, "Project name is required"),
  description: z.string().min(1, "Project description is required"),
  progress_indicator: z.coerce
    .number()
    .min(1, "Progress indicator is required"),
  fca_ids: z.array(z.string()).optional(),
  total_alloted_area: z.coerce.number().optional(),
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
  isAdmin: boolean;
};
export default function EditProjectNameForm({
  project,
  isAdmin,
}: EditProjectNameFormProps) {
  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: project.id as string,
      project_name: project.project_name || "",
      description: project.description || "",
      progress_indicator: project.progress_indicator || 1,
      fca_ids: project.fca_ids || [],
      total_alloted_area: project.total_alloted_area || 0,
      status: project.status || 0,
    },
  });

  const { mutate, isPending } = useEditProjectHook();
  const handleSubmit = (data: FormSchemaType) => mutate(data);
  const { openModal, closeModal } = useModal();

  return (
    <>
      <form
        className="w-full flex flex-col items-start space-y-6 px-4"
        id="edit-project-form"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <Label className="font-semibold w-full mb-4">General Settings</Label>
        <FormInput label="Project ID" name="id" form={form} readOnly copy />
        <FormInput
          label="Project name"
          name="project_name"
          form={form}
          readOnly={!isAdmin}
        />
        <FormTextarea
          form={form}
          name="description"
          label="Project Description"
          readOnly={!isAdmin}
        />
        <FCASelector
          onChange={(value) => form.setValue("fca_ids", value)}
          defaultValue={project.fca_ids || []}
          readOnly={!isAdmin}
        />
        <FormInput
          label="Total Allotment Area (in hectares)"
          name="total_alloted_area"
          form={form}
          readOnly={!isAdmin}
        />
        <div className="w-full flex justify-between items-center">
          <Label>Set Active</Label>
          <Switch
            checked={form.watch("status") === 1}
            onCheckedChange={(checked) =>
              form.setValue("status", checked ? 1 : 0)
            }
            disabled={!isAdmin}
          />
        </div>
        <div className="w-full flex justify-between items-center">
          <Label>Project&apos;s Progress</Label>
          <Select
            defaultValue={project.progress_indicator?.toString()}
            onValueChange={(value) =>
              form.setValue("progress_indicator", parseInt(value))
            }
            disabled={!isAdmin}
          >
            <SelectTrigger className="w-[230px]">
              <SelectValue placeholder="Progress" />
            </SelectTrigger>
            <SelectContent>
              {cornGrowthStages.map((stage) => (
                <SelectItem key={stage.value} value={stage.value}>
                  {stage.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </form>
      {isAdmin && (
        <CardFooter className="w-full justify-end border-t mt-4 p-2">
          <Button
            onClick={() =>
              openModal(
                "Are you sure?",
                "This action cannot be undone. Do you want to proceed?",
                <Button
                  onClick={() => {
                    form.handleSubmit(handleSubmit)();
                    closeModal();
                  }}
                  className="w-full"
                >
                  Confirm
                </Button>
              )
            }
            size={"sm"}
            variant={isPending ? "ghost" : "default"}
            disabled={isPending}
          >
            {isPending ? <Loader2 className="animate-spin" /> : "Save Changes"}
          </Button>
        </CardFooter>
      )}
    </>
  );
}
