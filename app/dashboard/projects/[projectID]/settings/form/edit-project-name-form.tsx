import FormInput from "@/components/custom/input/form-input";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useEditProjectNameHook,
  useSelectProgramAndProjectDetailsByProgjectIDHook,
} from "@/components/hooks";
import { CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  id: z.string().min(1, "Project ID is required"),
  project_name: z.string().min(1, "Project name is required"),
});
export default function EditProjectNameForm() {
  const { projectID } = useParams();
  const { data: projectData } =
    useSelectProgramAndProjectDetailsByProgjectIDHook(projectID as string);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: projectID as string,
      project_name: projectData?.project_name || "",
    },
  });

  const { mutate, isPending } = useEditProjectNameHook();
  const handleSubmit = (data: z.infer<typeof formSchema>) => mutate(data);

  return (
    <>
      <form
        className="w-full flex flex-col items-start space-y-4"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <FormInput label="Project ID" name="id" form={form} readonly copy />
        <FormInput label="Project name" name="project_name" form={form} />
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
