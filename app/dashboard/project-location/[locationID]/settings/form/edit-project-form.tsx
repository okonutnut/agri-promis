"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { ProjectLocationType } from "@/components/types";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useModal } from "@/components/custom/layout/custom-page-layout";
import z from "zod";
import FormInput from "@/components/custom/input/form-input";
import FormTextarea from "@/components/custom/input/form-textarea";
import FCASelector from "@/components/custom/dropdown/fca-selector";
import ContactPersonsInput from "@/components/custom/input/contact-persons-input";
import { useParams } from "next/navigation";
import { useUniversalMutation } from "@/hooks/use-universal-mutation";
import { toast } from "sonner";
import { EditProjectLocationAction } from "@/app/actions/ProjectLocationAction";
import { Spinner } from "@/components/ui/spinner";

const formSchema = z.object({
  id: z.string().min(1, "Project ID is required"),
  description: z.string().min(1, "Project description is required"),
  progress_indicator: z.coerce
    .number()
    .min(1, "Progress indicator is required"),
  fca_ids: z.array(z.string()).optional(),
  contact_persons: z.array(z.object({ name: z.string(), position: z.string() })).optional(),
  total_alloted_area: z.coerce.number().optional(),
  status: z
    .number()
    .refine(
      (val) => [0, 1].includes(val),
      "Status must be either 0 (inactive) or 1 (active)",
    ),
});
type FormSchemaType = z.infer<typeof formSchema>;

type EditProjectNameFormProps = {
  project: ProjectLocationType;
};
export default function EditProjectNameForm({
  project,
}: EditProjectNameFormProps) {
  const { locationID } = useParams();
  const { openModal, closeModal } = useModal();

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: locationID as string,
      description: project.description || "",
      progress_indicator: project.progress_indicator || 1,
      fca_ids: project.fca_ids || [],
      contact_persons: project.contact_persons || [],
      total_alloted_area: project.total_alloted_area || 0,
      status: project.status || 0,
    },
  });

  const { mutate, isPending } = useUniversalMutation({
    mutationFn: async (data: FormSchemaType) =>
      await EditProjectLocationAction({
        id: data.id,
        description: data.description,
        progress_indicator: data.progress_indicator,
        fca_ids: data.fca_ids,
        contact_persons: data.contact_persons,
        total_alloted_area: data.total_alloted_area,
        status: data.status,
      }),
    invalidateKeys: ["project", "project_location", "location", "dashboard_items"],
    onSuccess: () => {
      toast.success("Project updated successfully");
    },
    onError: () => {
      toast.error("Error updating project");
    },
  });
  const handleSubmit = (data: FormSchemaType) => mutate(data);

  return (
    <Card className="rounded-md shadow-xs mb-4">
      <form
        className="w-full flex flex-col items-start space-y-6 px-4"
        id="edit-project-form"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <Label className="font-semibold w-full mb-4">General Settings</Label>
        <FormInput label="Project ID" name="id" form={form} readOnly copy />
        <FormTextarea
          form={form}
          name="description"
          label="Project Description"
          readOnly={isPending}
        />
        <FCASelector
          onChange={(value) => form.setValue("fca_ids", value)}
          defaultValue={project.fca_ids || []}
          readOnly={isPending}
        />
        <ContactPersonsInput
          label="Contact Persons"
          value={form.watch("contact_persons") || []}
          onChange={(contacts) => form.setValue("contact_persons", contacts)}
        />
        <FormInput
          label="Total Allotment Area (in hectares)"
          name="total_alloted_area"
          form={form}
          readOnly={isPending}
        />
        <div className="w-full flex justify-between items-center">
          <Label>Set Active</Label>
          <Switch
            checked={form.watch("status") === 1}
            onCheckedChange={(checked) =>
              form.setValue("status", checked ? 1 : 0)
            }
            disabled={isPending}
          />
        </div>
        {/* <div className="w-full flex justify-between items-center">
          <Label>Project&apos;s Progress</Label>
          <Select
            defaultValue={project.progress_indicator?.toString()}
            onValueChange={(value) =>
              form.setValue("progress_indicator", parseInt(value))
            }
            disabled={isPending}
          >
            <SelectTrigger className="w-57.5">
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
        </div> */}
      </form>
      <CardFooter className="w-full justify-end border-t mt-4 p-2">
        <Button
          onClick={() => {
            form.handleSubmit(handleSubmit)();
          }}
          size={"sm"}
          variant={isPending ? "ghost" : "default"}
          disabled={isPending}
        >
          {isPending ? (
            <>
              <Spinner /> Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
