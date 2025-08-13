"use client";

import { useDeleteFieldTechnicianToProjectHook } from "@/components/hooks";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect } from "react";

type RemoveFTButtonProps = {
  userID: string;
  closeBtnRef?: React.RefObject<HTMLButtonElement | null>;
  setIsLoading: (isLoading: boolean) => void;
};
export default function RemoveFTButton({
  userID,
  closeBtnRef,
  setIsLoading,
}: RemoveFTButtonProps) {
  const { projectID } = useParams();
  const { mutate, isPending } = useDeleteFieldTechnicianToProjectHook(
    projectID as string
  );
  const onSubmit = () =>
    mutate(userID, {
      onSuccess: () => {
        if (closeBtnRef?.current) {
          closeBtnRef.current.click();
        }
      },
    });

  useEffect(() => {
    if (isPending) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [isPending, setIsLoading]);

  return (
    <Button variant={"outline"} size={"sm"} onClick={() => onSubmit()}>
      {isPending ? (
        <Loader2 className="animate-spin" />
      ) : (
        <>
          <AlertTriangle color="red" />
          Remove From Project
        </>
      )}
    </Button>
  );
}
