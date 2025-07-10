import {
  InsertProgramAction,
  SelectProgramByIdAction,
  SelectAllProgramsByAgriculturistAction,
  InsertProjectAction,
  SelectAllProjectsByProgramIDAction,
} from "@/components/actions";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ProgramType, ProjectType } from "./types";

// PROGRAM HOOKS
export function SelectProgramByIDHook(programId: string) {
  return useQuery({
    queryKey: ["programById", programId],
    queryFn: async () => await SelectProgramByIdAction(programId),
    enabled: !!programId,
  });
}

export function SelectAllProgramsByAgriculturistHook() {
  return useQuery({
    queryKey: ["allProgramsByAgriculturist"],
    queryFn: async () => await SelectAllProgramsByAgriculturistAction(),
  });
}

export function InsertProgramHook() {
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: ProgramType) => await InsertProgramAction(data),
    onSuccess: (data) => {
      SelectAllProgramsByAgriculturistHook().refetch();
      toast.success("Program created successfully!");
      router.push(`/agriculturist/${data.id}/dashboard`);
    },
    onError: (error) => {
      toast.error(`Failed to create program: ${error.message}`);
    },
  });
}

// PROJECT HOOKS
export function SelectAllProjectsByProgramIDHook(programId: string) {
  return useQuery({
    queryKey: ["allProjectsByProgramId", programId],
    queryFn: async () => await SelectAllProjectsByProgramIDAction(programId),
    enabled: !!programId,
  });
}

export function InsertProjectHook() {
  const router = useRouter();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (data: ProjectType) => await InsertProjectAction(data),
    onSuccess: (data) => {
      toast.success("Project created successfully!", {
        position: "bottom-right",
      });
      qc.invalidateQueries({
        queryKey: ["allProjectsByProgramId", data.program_id],
      });

      router.push(`/agriculturist/${data.program_id}/project/${data.id}`);
    },
    onError: (error) => {
      toast.error(`${error.message}`, {
        position: "bottom-right",
      });
    },
  });
}
