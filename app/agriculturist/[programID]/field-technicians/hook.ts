import { useMutation, useQuery } from "@tanstack/react-query";
import {
  InsertFieldTechnicianAction,
  SelectAllFieldTechnicianAction,
} from "./actions";
import { UserProfile } from "./types";
import { toast } from "sonner";

export function SelectAllFieldTecnicianHook() {
  return useQuery({
    queryKey: ["fieldTechnicians"],
    queryFn: async () => await SelectAllFieldTechnicianAction(),
  });
}

export function InsertFieldTechnicianHook() {
  return useMutation({
    mutationFn: async (data: UserProfile) =>
      await InsertFieldTechnicianAction(data),
    onSuccess: () => {
      SelectAllFieldTecnicianHook().refetch();
    },
    onError: () => {
      console.error("Failed to create field technician");
      toast.error("Failed to create field technician");
    },
  });
}
