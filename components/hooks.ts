import {
  InsertProgramAction,
  SelectProgramByIdAction,
  SelectAllProgramsByAgriculturistAction,
  InsertProjectAction,
  SelectAllProjectsByProgramIDAction,
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
  DeleteProjectAction,
  InsertRemarksInMonitoringReportAction,
  InsertPostActivityReportAction,
  SelectAllPostActivityReportsByUserID,
  SelectAllMonitoringReportsByProjectIDAndUserAction,
  SelectAllPostActivityReportsByProjectIDAction,
  InsertPostActivityRemarksAction,
  SelectUserCurrentLocationAction,
  SelectAllUserProfilesAction,
  InsertTravelOrderAction,
  SelectAllTravelOrdersByProgramIDAction,
  SelectActivityLogsByUserIDAction,
  SelectAllActivityLogsAction,
} from "@/components/actions";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  AssignedProjectsType,
  MonitoringReportType,
  PostActivityReportType,
  ProgramType,
  ProjectType,
  TravelOrderType,
  UserProfileType,
} from "./types";
import { createClient } from "@/utils/supabase/client";

// USER PROFILE HOOKS
export function useSelectAllUserProfilesHook() {
  return useQuery({
    queryKey: ["userProfiles"],
    queryFn: async () => await SelectAllUserProfilesAction(),
    refetchOnMount: true,
    refetchInterval: 3000,
    networkMode: "online",
  });
}

export function useSelectUserProfileHook() {
  return useQuery({
    queryKey: ["userProfile"],
    queryFn: async () => await SelectUserProfileAction(),
    refetchOnMount: true,
    refetchInterval: 3000,
    networkMode: "online",
  });
}

export function useSelectCurrentUserSessionHook() {
  const supabase = createClient();
  return useQuery({
    queryKey: ["currentUserSession"],
    queryFn: async () => {
      const { session } = (await supabase.auth.getSession()).data;
      return session;
    },
    refetchOnMount: true,
    refetchInterval: 3000,
    networkMode: "online",
  });
}

// PROGRAM HOOKS
export function useSelectProgramByIDHook(programId: string) {
  return useQuery({
    queryKey: ["programById", programId],
    queryFn: async () => await SelectProgramByIdAction(programId),
    enabled: !!programId,
    refetchOnMount: true,
    refetchInterval: 3000,
    networkMode: "online",
  });
}

export function useSelectAllProgramsByAgriculturistHook() {
  return useQuery({
    queryKey: ["allProgramsByAgriculturist"],
    queryFn: async () => await SelectAllProgramsByAgriculturistAction(),
    refetchOnMount: true,
    refetchInterval: 3000,
    networkMode: "online",
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
      toast("Program created successfully!");
      router.push(`/dashboard/programs/${data.id}/`);
    },
    onError: (error) => {
      toast.error(`Failed to create program: ${error.message}`);
      router.push("/dashboard/programs/");
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
      toast("Program name updated successfully!");
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
      toast("Program deleted successfully!");
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
    refetchInterval: 3000,
    networkMode: "online",
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
    refetchInterval: 3000,
    networkMode: "online",
  });
}

export function useSelectProjectDetailsHook(projectId: string) {
  return useQuery({
    queryKey: ["projectDetails", projectId],
    queryFn: async () => await SelectProjectDetailsByProjectIDAction(projectId),
    enabled: !!projectId,
    refetchOnMount: true,
    refetchInterval: 3000,
    networkMode: "online",
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
      toast("Project created successfully!");
      router.push(`/dashboard/projects/${data.id}`);
    },
    onError: (error) => {
      toast.error(`${error.message}`);
      router.push(`/dashboard/projects/`);
    },
  });
}

export function useEditProjectNameHook() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      id: string;
      project_name: string;
      status: number;
    }) =>
      await EditProjectNameAction({
        project_id: data.id ?? "",
        project_name: data.project_name,
        status: data.status,
      }),
    onSuccess: (data) => {
      qc.invalidateQueries({
        queryKey: ["programAndProjectDetailsByProjectId", data.id],
      });
      qc.invalidateQueries({
        queryKey: ["allProjectsByProgramId", data.program_id],
      });
      toast("Project updated successfully!");
    },
    onError: (error) => {
      toast.error(`Failed to update project name: ${error.message}`);
    },
  });
}

export function useDeleteProjectHook(projectId: string, programId: string) {
  const qc = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: async () => await DeleteProjectAction(projectId),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["allProjectsByProgramId", programId],
      });
      toast("Project deleted successfully!");
      router.push("/dashboard/programs/" + programId);
    },
    onError: (error) => {
      toast.error(`Failed to delete project: ${error.message}`);
    },
  });
}

// TRAVEL ORDER HOOKS
export function useInsertTravelOrderHook() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: TravelOrderType) =>
      await InsertTravelOrderAction(data),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["travelOrders"],
      });
      toast("Travel order issued successfully!");
    },
    onError: (error) => {
      toast.error(`Failed to issue travel order: ${error.message}`);
    },
  });
}

export function useSelectAllTravelOrdersByProgramIDHook(programID: string) {
  return useQuery({
    queryKey: ["travelOrders"],
    queryFn: async () =>
      await SelectAllTravelOrdersByProgramIDAction(programID),
    enabled: !!programID,
    refetchOnMount: true,
    refetchInterval: 3000,
    networkMode: "online",
  });
}

// MONITORING REPORT HOOKS
export function useSelectAllMonitoringReportsByProjectIDHook(
  projectID: string
) {
  return useQuery({
    queryKey: ["allMonitoringReportsByProjectId"],
    queryFn: async () =>
      await SelectAllMonitoringReportsByProjectIDAction(projectID),
    enabled: !!projectID,
    refetchInterval: 3000,
    refetchOnMount: true,
    networkMode: "online",
  });
}

export function useInsertMonitoringReportHook() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: MonitoringReportType) =>
      await InsertMonitoringReportAction(data),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["allMonitoringReportsByUser"],
      });
      toast("Monitoring report created successfully!");
    },
    onError: (error) => {
      toast.error(`Failed to create monitoring report: ${error.message}`);
    },
  });
}

export function useInsertRemarksInMonitoringReportHook(reportId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: { remarks: string }) =>
      await InsertRemarksInMonitoringReportAction(reportId, data.remarks),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["allMonitoringReportsByProjectId"],
      });
      toast("Remarks added successfully!");
    },
    onError: (error) => {
      toast.error(`Failed to add remarks: ${error.message}`);
    },
  });
}

export function useSelectAllMonitoringReportsByProjectIDAndUserHook(
  projectID: string
) {
  return useQuery({
    queryKey: ["allMonitoringReportsByUser", projectID],
    queryFn: async () =>
      await SelectAllMonitoringReportsByProjectIDAndUserAction(projectID),
    refetchInterval: 3000,
    refetchOnMount: true,
    networkMode: "online",
  });
}

// MEMBER HOOKS
export function useInsertMemberHook() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: UserProfileType) => await InsertMemberAction(data),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["members"],
      });
      toast("Member invited successfully!");
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
    refetchInterval: 3000,
    networkMode: "online",
  });
}

export function useSelectAllMembersByRoleHook(role: string) {
  return useQuery({
    queryKey: ["members", role],
    queryFn: async () => await SelectAllMembersByRoleAction(role),
    enabled: !!role,
    refetchOnMount: true,
    refetchInterval: 3000,
    networkMode: "online",
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
      toast("Field technician added to project successfully!");
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
    refetchInterval: 3000,
    networkMode: "online",
  });
}

export function useSelectAssignedProjectsByFieldTechnicianHook() {
  return useQuery({
    queryKey: ["assignedProjectsByFieldTechnician"],
    queryFn: async () =>
      await SelectAllAssignedProjectsByFieldTechnicianIDAction(),
    refetchOnMount: true,
    refetchInterval: 3000,
    networkMode: "online",
  });
}

// POST ACTIVITY REPORT HOOKS
export function useInsertPostActivityReportHook() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: PostActivityReportType) =>
      await InsertPostActivityReportAction(data),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["postActivityReport"],
      });
      toast("Post activity report submitted successfully!");
    },
    onError: (error) => {
      toast.error(`Failed to submit post activity report: ${error.message}`);
    },
  });
}

export function useInsertPostActivityRemarksHook() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: PostActivityReportType) =>
      await InsertPostActivityRemarksAction(data),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["postActivityReport"],
      });
      toast("Remarks submitted successfully!");
    },
    onError: (error) => {
      toast.error(`Failed to submit remarks: ${error.message}`);
    },
  });
}

export function useSelectAllPostActivityReportsByProjectIDHook(
  projectID: string
) {
  return useQuery({
    queryKey: ["postActivityReport"],
    queryFn: async () =>
      await SelectAllPostActivityReportsByProjectIDAction(projectID),
    enabled: !!projectID,
    refetchOnMount: true,
    refetchInterval: 3000,
    networkMode: "online",
  });
}

export function useSelectAllPostActivityReportsByUserHook() {
  return useQuery({
    queryKey: ["postActivityReport"],
    queryFn: async () => await SelectAllPostActivityReportsByUserID(),
    refetchOnMount: true,
    refetchInterval: 3000,
    networkMode: "online",
  });
}

// LOCATION HOOKS
export function useSelectUserLocationHook(user_id: string) {
  return useQuery({
    queryKey: ["userLocation", user_id],
    queryFn: async () => await SelectUserCurrentLocationAction(user_id),

    refetchOnMount: true,
    refetchInterval: 3000,
    networkMode: "online",
  });
}

// ACTIVITY LOG HOOKS
export function useSelectActivityLogsByUserIDHook(user_id: string) {
  return useQuery({
    queryKey: ["activity-logs"],
    queryFn: async () => await SelectActivityLogsByUserIDAction(user_id),
    refetchOnMount: true,
    refetchInterval: 3000,
    networkMode: "online",
  });
}

export function useSelectAllActivityLogsHook() {
  return useQuery({
    queryKey: ["activity-logs"],
    queryFn: async () => await SelectAllActivityLogsAction(),
    refetchInterval: 3000,
    refetchOnMount: true,
    networkMode: "online",
  });
}
