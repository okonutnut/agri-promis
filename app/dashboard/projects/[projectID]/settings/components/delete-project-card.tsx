import CustomAlertDialog from "@/components/custom/alert/custom-alert";
import { useDeleteProjectHook } from "@/components/hooks";
import { ProjectType } from "@/components/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, Loader2 } from "lucide-react";
import { useState } from "react";

type DeleteProjectCardProps = {
  data: ProjectType;
  programID: string;
};
export default function DeleteProjectCard({
  data,
  programID,
}: DeleteProjectCardProps) {
  const [confirm, setConfirm] = useState(false);
  const { mutate, isPending, isSuccess } = useDeleteProjectHook(
    data.id as string,
    programID
  );

  return (
    <Card className="shadow-xs bg-red-50 border-red-200">
      <CardContent className="flex flex-col flex-wrap justify-between items-start space-y-4">
        <div className="flex gap-2 items-center font-semibold w-full mb-4 text-red-600">
          <AlertCircle />
          Danger Zone
        </div>
        <span>
          This will delete the project and all associated data. This action
          cannot be undone.
        </span>
        <CustomAlertDialog
          trigger={
            <Button variant={"destructive"} size="sm">
              Delete Project
            </Button>
          }
          title="Delete Project"
          description="Are you sure you want to delete this project? This action cannot be undone."
          onClose={() => {
            if (isSuccess) {
              setConfirm(false);
            }
            setConfirm(false);
          }}
        >
          <Separator />
          <center className="text-sm">
            Type <strong>{data.project_name}</strong> to continue.
          </center>
          <Input
            onChange={(e) =>
              setConfirm(e.target.value === data.project_name.trim())
            }
          />
          <Separator />
          <Button
            variant={isPending ? "ghost" : "destructive"}
            disabled={!confirm || isPending}
            onClick={() => mutate()}
          >
            {isPending ? (
              <Loader2 className="animate-spin" />
            ) : (
              "Confirm Delete"
            )}
          </Button>
        </CustomAlertDialog>
      </CardContent>
    </Card>
  );
}
