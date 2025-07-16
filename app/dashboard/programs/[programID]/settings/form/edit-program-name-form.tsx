import FormInput from "@/components/custom/input/form-input";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useEditProgramNameHook,
  useSelectProgramByIDHook,
} from "@/components/hooks";
import { CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  program_name: z.string().min(1, "Program name is required"),
  id: z.string().min(1, "Program ID is required"),
});
export default function EditProgramNameForm() {
  const { programID } = useParams();
  const { data: programData } = useSelectProgramByIDHook(programID as string);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: programID as string,
      program_name: programData?.program_name ?? "",
    },
  });

  const { mutate, isPending } = useEditProgramNameHook();
  const handleSubmit = (data: z.infer<typeof formSchema>) => mutate(data);
  return (
    <>
      <form
        className="w-full flex flex-col items-start space-y-4"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <FormInput label="Program ID" name="id" form={form} readonly copy />
        <FormInput label="Program name" name="program_name" form={form} />
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
