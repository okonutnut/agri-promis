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
  InsertMemberAction,
  SelectAllMembersAction,
  InsertFieldTechnicianToProjectAction,
  SelectAllFieldTechniciansByProjectIDAction,
  SelectAllMembersByRoleAction,
  SelectAllAssignedProjectsByFieldTechnicianIDAction,
  SelectProjectDetailsByProjectIDAction,
  SelectUserProfileAction,
  DeleteProgramAction,
  SelectAllMonitoringReportsByProjectIDAction,
  InsertMonitoringReportAction,
} from "@/components/actions";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  AssignedProjectsType,
  MonitoringReportType,
  ProgramType,
  ProjectType,
  UserProfile,
} from "./types";

// USER PROFILE HOOKS
export function useSelectUserProfileHook() {
  return useQuery({
    queryKey: ["userProfile"],
    queryFn: async () => await SelectUserProfileAction(),
    refetchOnMount: true,
  });
}

// PROGRAM HOOKS
export function useSelectProgramByIDHook(programId: string) {
  return useQuery({
    queryKey: ["programById", programId],
    queryFn: async () => await SelectProgramByIdAction(programId),
    enabled: !!programId,
    refetchOnMount: true,
  });
}

export function useSelectAllProgramsByAgriculturistHook() {
  return useQuery({
    queryKey: ["allProgramsByAgriculturist"],
    queryFn: async () => await SelectAllProgramsByAgriculturistAction(),
    refetchOnMount: true,
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
      toast.success("Program created successfully!");
      router.push(`/dashboard/programs/${data.id}/`);
    },
    onError: (error) => {
      toast.error(`Failed to create program: ${error.message}`);
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
      toast.success("Program name updated successfully!");
    },
    onError: (error) => {
      toast.error(`Failed to update program name: ${error.message}`);
    },
  });
}

export function useDeleteProgramHook(programId: string) {
  const qc = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: async () => await DeleteProgramAction(programId),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["allProgramsByAgriculturist"],
      });
      toast.success("Program deleted successfully!");
      router.push("/dashboard/programs");
    },
    onError: (error) => {
      toast.error(`Failed to delete program: ${error.message}`);
    },
  });
}

// PROJECT HOOKS
export function useSelectAllProjectsByProgramIDHook(programId: string) {
  return useQuery({
    queryKey: ["allProjectsByProgramId", programId],
    queryFn: async () => await SelectAllProjectsByProgramIDAction(programId),
    enabled: !!programId,
    refetchOnMount: true,
  });
}

export function useSelectProgramAndProjectDetailsByProgjectIDHook(
  projectId: string
) {
  return useQuery({
    queryKey: ["programAndProjectDetailsByProjectId", projectId],
    queryFn: async () =>
      await SelectProgramAndProjectDetailsByProjectIDAction(projectId),
    enabled: !!projectId,
    refetchOnMount: true,
  });
}

export function useSelectProjectDetailsHook(projectId: string) {
  return useQuery({
    queryKey: ["projectDetails", projectId],
    queryFn: async () => await SelectProjectDetailsByProjectIDAction(projectId),
    enabled: !!projectId,
    refetchOnMount: true,
  });
}

export function useInsertProjectHook() {
  const router = useRouter();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (data: ProjectType) => await InsertProjectAction(data),
    onSuccess: (data) => {
      qc.invalidateQueries({
        queryKey: ["allProjectsByProgramId", data.program_id],
      });
      toast.success("Project created successfully!");
      router.push(`/dashboard/projects/${data.id}`);
    },
    onError: (error) => {
      toast.error(`${error.message}`);
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
      toast.success("Project name updated successfully!");
    },
    onError: (error) => {
      toast.error(`Failed to update project name: ${error.message}`);
    },
  });
}

// LOCATION HOOKS
export function useSelectLocationByID(locationID: string) {
  return useQuery({
    queryKey: ["locationByProjectId", locationID],
    queryFn: async () => await SelectLocationByIDAction(locationID),
    enabled: !!locationID,
    refetchOnMount: true,
  });
}

// MONITORING REPORT HOOKS
export function useSelectAllMonitoringReportsByProjectIDHook(
  projectID: string
) {
  return useQuery({
    queryKey: ["allMonitoringReportsByProjectId", projectID],
    queryFn: async () =>
      await SelectAllMonitoringReportsByProjectIDAction(projectID),
    enabled: !!projectID,
    refetchOnMount: true,
  });
}

export function useInsertMonitoringReportHook() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: MonitoringReportType) =>
      await InsertMonitoringReportAction(data),
    onSuccess: (data) => {
      qc.invalidateQueries({
        queryKey: ["allMonitoringReportsByProjectId", data.project_id],
      });
      toast.success("Monitoring report created successfully!");
      window.location.reload();
    },
    onError: (error) => {
      toast.error(`Failed to create monitoring report: ${error.message}`);
    },
  });
}

// MEMBER HOOKS
export function useInsertMemberHook() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: UserProfile) => await InsertMemberAction(data),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["members"],
      });
      toast.success("Member invited successfully!");
      window.location.reload();
    },
    onError: () => {
      console.error("Failed to invite member.");
      toast.error("Failed to invite member.");
    },
  });
}

export function useSelectAllMembersHook() {
  return useQuery({
    queryKey: ["members"],
    queryFn: async () => await SelectAllMembersAction(),
    refetchOnMount: true,
  });
}

export function useSelectAllMembersByRoleHook(role: string) {
  return useQuery({
    queryKey: ["members", role],
    queryFn: async () => await SelectAllMembersByRoleAction(role),
    enabled: !!role,
    refetchOnMount: true,
  });
}

// ASSIGNED PROJECTS HOOKS
export function useInsertFieldTechnicianToProjectHook(project_id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: AssignedProjectsType) =>
      await InsertFieldTechnicianToProjectAction(data, project_id),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["fieldTechnicians", project_id],
      });
      toast.success("Field technician added to project successfully!");
    },
    onError: (error) => {
      console.error("Failed to add field technician to project:", error);
      toast.error(`Failed to add field technician: ${error.message}`);
    },
  });
}

export function useSelectFieldTechniciansByProjectIDHook(project_id: string) {
  return useQuery({
    queryKey: ["fieldTechnicians", project_id],
    queryFn: async () =>
      await SelectAllFieldTechniciansByProjectIDAction(project_id),
    enabled: !!project_id,
    refetchOnMount: true,
  });
}

export function useSelectAssignedProjectsByFieldTechnicianHook() {
  return useQuery({
    queryKey: ["assignedProjectsByFieldTechnician"],
    queryFn: async () =>
      await SelectAllAssignedProjectsByFieldTechnicianIDAction(),
    refetchOnMount: true,
  });
}
