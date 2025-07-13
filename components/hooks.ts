import {
  InsertProgramAction,
  SelectProgramByIdAction,
  SelectAllProgramsByAgriculturistAction,
  InsertProjectAction,
  SelectAllProjectsByProgramIDAction,
  SelectLocationByIDAction,
  EditProgramNameAction,
  SelectProgramAndProjectDetailsByProjectIDAction,
  EditProjectNameAction,
  SelectAllFieldReportsByProjectIDAction,
} from "@/components/actions";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ProgramType, ProjectType } from "./types";

// PROGRAM HOOKS
export function useSelectProgramByIDHook(programId: string) {
  return useQuery({
    queryKey: ["programById", programId],
    queryFn: async () => await SelectProgramByIdAction(programId),
    enabled: !!programId,
  });
}

export function useSelectAllProgramsByAgriculturistHook() {
  return useQuery({
    queryKey: ["allProgramsByAgriculturist"],
    queryFn: async () => await SelectAllProgramsByAgriculturistAction(),
  });
}

export function useInsertProgramHook() {
  const qc = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: ProgramType) => await InsertProgramAction(data),
    onSuccess: (data) => {
      qc.invalidateQueries({
        queryKey: ["allProgramsByAgriculturist"],
      });
      toast.success("Program created successfully!", {
        position: "bottom-right",
        duration: 2000,
      });
      router.push(`/dashboard/programs/${data.id}/`);
    },
    onError: (error) => {
      toast.error(`Failed to create program: ${error.message}`, {
        position: "bottom-right",
        duration: 2000,
      });
    },
  });
}

export function useEditProgramNameHook() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (data: ProgramType) =>
      await EditProgramNameAction({
        program_id: data.id ?? "",
        program_name: data.program_name,
      }),
    onSuccess: (data) => {
      qc.invalidateQueries({
        queryKey: ["programById", data.id],
      });
      qc.invalidateQueries({
        queryKey: ["allProgramsByAgriculturist"],
      });
      toast.success("Program name updated successfully!", {
        position: "bottom-right",
        duration: 2000,
      });
    },
    onError: (error) => {
      toast.error(`Failed to update program name: ${error.message}`, {
        position: "bottom-right",
        duration: 2000,
      });
    },
  });
}

// PROJECT HOOKS
export function useSelectAllProjectsByProgramIDHook(programId: string) {
  return useQuery({
    queryKey: ["allProjectsByProgramId", programId],
    queryFn: async () => await SelectAllProjectsByProgramIDAction(programId),
  });
}

export function useSelectProgramAndProjectDetailsByProgjectIDHook(
  projectId: string
) {
  return useQuery({
    queryKey: ["programAndProjectDetailsByProjectId", projectId],
    queryFn: async () =>
      await SelectProgramAndProjectDetailsByProjectIDAction(projectId),
  });
}

export function useInsertProjectHook() {
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

      router.push(`/dashboard/projects/${data.id}`);
    },
    onError: (error) => {
      toast.error(`${error.message}`, {
        position: "bottom-right",
      });
    },
  });
}

export function useEditProjectNameHook() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: { id: string; project_name: string }) =>
      await EditProjectNameAction({
        project_id: data.id ?? "",
        project_name: data.project_name,
      }),
    onSuccess: (data) => {
      qc.invalidateQueries({
        queryKey: ["programAndProjectDetailsByProjectId", data.id],
      });
      qc.invalidateQueries({
        queryKey: ["allProjectsByProgramId", data.program_id],
      });
      toast.success("Project name updated successfully!", {
        position: "bottom-right",
        duration: 2000,
      });
    },
    onError: (error) => {
      toast.error(`Failed to update project name: ${error.message}`, {
        position: "bottom-right",

        duration: 2000,
      });
    },
  });
}

// LOCATION HOOKS
export function useSelectLocationByID(locationID: string) {
  return useQuery({
    queryKey: ["locationByProjectId", locationID],
    queryFn: async () => await SelectLocationByIDAction(locationID),
  });
}

// FIELD REPORT HOOKS
export function useSelectAllFieldReportsByProjectIDHook(projectID: string) {
  return useQuery({
    queryKey: ["allFieldReportsByProjectId", projectID],
    queryFn: async () =>
      await SelectAllFieldReportsByProjectIDAction(projectID),
  });
}
