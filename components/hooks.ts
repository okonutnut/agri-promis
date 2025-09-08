"use client";

import {
  SelectDashboardItemsAction,
  SelectUserDashboardItemsAction,
  SelectAdminDashboardItemsAction,
} from "@/app/actions/DashboardAction";
import {
  SelectActivityLogsByUserIDAction,
  SelectAllActivityLogsAction,
  SelectActivityLogsByProjectIDAction,
  SelectAllActivityLogsByCurrentUserAction,
} from "@/app/actions/ActivityLogAction";
import {
  SelectUserCurrentLocationAction,
  UpdateUserCurrentLocationAction,
} from "@/app/actions/UserSessionAction";
import {
  SelectAllFieldTechniciansByProjectIDAction,
  SelectAllAssignedProjectsByFieldTechnicianIDAction,
  DeleteFieldTechnicianFromProjectAction,
  InsertFieldTechniciansToProjectAction,
} from "@/app/actions/AssignedProjectAction";
import {
  InsertMemberAction,
  SelectAllMembersAction,
  SelectAllMembersByRoleAction,
  UpdateMemberAction,
  UpdateActiveStatusMemberAction,
} from "@/app/actions/MemberAction";
import {
  SelectAllMonitoringReportsByProjectIDAction,
  InsertMonitoringReportAction,
  InsertRemarksInMonitoringReportAction,
  SelectAllMonitoringReportsByProjectIDAndUserAction,
  SelectAllMonitoringReportsByCurrentUserAction,
} from "@/app/actions/MonitoringAction";
import {
  InsertTravelOrderAction,
  SelectAllTravelOrdersByProgramIDAction,
  SelectAllTravelOrdersByUserIDAction,
} from "@/app/actions/TravelOrderAction";
import {
  InsertProjectAction,
  SelectAllProjectsByProgramIDAction,
  SelectProgramAndProjectDetailsByProjectIDAction,
  EditProjectAction,
  SelectProjectDetailsByProjectIDAction,
  DeleteProjectAction,
  SelectAllProjectsByUserIDAction,
} from "@/app/actions/ProjectAction";
import {
  InsertProgramAction,
  SelectProgramByIdAction,
  SelectAllProgramsByAgriculturistAction,
  EditProgramNameAction,
  DeleteProgramAction,
  SelectAllProgramsByUserIDAction,
  SelectAllProgramsAction,
  SelectUserByProgramAssignedAction,
} from "@/app/actions/ProgramAction";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  MonitoringReportType,
  ProgramType,
  ProjectType,
  TravelOrderType,
  UserProfileType,
} from "./types";

// PROGRAM HOOKS
export function useSelectProgramByIDHook(programId: string) {
  return useQuery({
    queryKey: ["programById", programId],
    queryFn: async () => await SelectProgramByIdAction(programId),
    enabled: !!programId,
    refetchInterval: 3000,
    networkMode: "online",
  });
}

export function useSelectAllProgramsByAgriculturistHook() {
  return useQuery({
    queryKey: ["allProgramsByAgriculturist"],
    queryFn: async () => await SelectAllProgramsByAgriculturistAction(),
    refetchInterval: 3000,
    networkMode: "online",
  });
}

export function useSelectAllProgramsByUserIDHook(userID: string) {
  return useQuery({
    queryKey: ["allProgramsByUserId", userID],
    queryFn: async () => await SelectAllProgramsByUserIDAction(userID),
    refetchInterval: 3000,
    networkMode: "online",
  });
}

export function useInsertProgramHook() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (data: ProgramType) => await InsertProgramAction(data),
    onSuccess: (data) => {
      qc.invalidateQueries({
        queryKey: ["allProgramsByAgriculturist"],
      });
      toast("Program created successfully!");
      window.location.href = `/dashboard/programs/${data.id}`;
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
      toast("Program name updated successfully!");
    },
    onError: (error) => {
      toast.error(`Failed to update program name: ${error.message}`);
    },
  });
}

export function useDeleteProgramHook(programId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async () => await DeleteProgramAction(programId),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["allProgramsByAgriculturist"],
      });
      toast("Program deleted successfully!");
      window.location.href = "/dashboard/programs";
    },
    onError: (error) => {
      toast.error(`Failed to delete program: ${error.message}`);
    },
  });
}

export function useSelectAllProgramsHook() {
  return useQuery({
    queryKey: ["programs"],
    queryFn: async () => await SelectAllProgramsAction(),
    refetchInterval: 3000,
    networkMode: "online",
  });
}

export function useSelectUsersByProgramAssignedHook(programId?: string) {
  return useQuery({
    queryKey: ["programs", programId],
    queryFn: async () => await SelectUserByProgramAssignedAction(programId),
    networkMode: "online",
  });
}

// PROJECT HOOKS
export function useSelectAllProjectsByProgramIDHook(programId: string) {
  return useQuery({
    queryKey: ["allProjectsByProgramId"],
    queryFn: async () => await SelectAllProjectsByProgramIDAction(programId),
    enabled: !!programId,
    refetchInterval: 3000,
    networkMode: "online",
  });
}

export function useSelectAllProjectsByUserIDHook(userID: string) {
  return useQuery({
    queryKey: ["allProjectsByUserId", userID],
    queryFn: async () => await SelectAllProjectsByUserIDAction(userID),
    networkMode: "online",
  });
}

export function useSelectProgramAndProjectDetailsByProgjectIDHook(
  projectId: string
) {
  return useQuery({
    queryKey: ["programAndProjectDetailsByProjectId"],
    queryFn: async () =>
      await SelectProgramAndProjectDetailsByProjectIDAction(projectId),
    enabled: !!projectId,
    refetchInterval: 3000,
    networkMode: "online",
  });
}

export function useSelectProjectDetailsHook(projectId: string) {
  return useQuery({
    queryKey: ["projectDetails", projectId],
    queryFn: async () => await SelectProjectDetailsByProjectIDAction(projectId),
    enabled: !!projectId,
    refetchInterval: 3000,
    networkMode: "online",
  });
}

export function useInsertProjectHook() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (data: ProjectType) => await InsertProjectAction(data),
    onSuccess: (data) => {
      qc.invalidateQueries({
        queryKey: ["allProjectsByProgramId"],
      });
      toast("Project created successfully!");
      window.location.href = `/dashboard/projects/${data.id}`;
    },
    onError: (error) => {
      toast.error(`${error.message}`, {
        duration: 2000,
      });
    },
  });
}

export function useEditProjectHook() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: ProjectType) => await EditProjectAction(data),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["programAndProjectDetailsByProjectId"],
      });
      qc.invalidateQueries({
        queryKey: ["allProjectsByProgramId"],
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

  return useMutation({
    mutationFn: async () => await DeleteProjectAction(projectId),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["allProjectsByProgramId"],
      });
      toast.error("Project deleted successfully!");
      window.location.href = "/dashboard/programs/" + programId;
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

export function useSelectAllTravelOrdersByUserIDHook(user_id?: string) {
  return useQuery({
    queryKey: ["travelOrders", user_id],
    queryFn: async () => await SelectAllTravelOrdersByUserIDAction(user_id),
    refetchInterval: 3000,
    networkMode: "online",
  });
}

export function useSelectAllTravelOrdersByProgramIDHook(programID: string) {
  return useQuery({
    queryKey: ["travelOrders"],
    queryFn: async () =>
      await SelectAllTravelOrdersByProgramIDAction(programID),
    enabled: !!programID,
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
    refetchInterval: 3000,
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
    mutationFn: async (remarks: string) =>
      await InsertRemarksInMonitoringReportAction(reportId, remarks),
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
    networkMode: "online",
  });
}

export function useSelectAllMonitoringReportsByCurrentUserHook() {
  return useQuery({
    queryKey: ["allMonitoringReportsByUser"],
    queryFn: async () => await SelectAllMonitoringReportsByCurrentUserAction(),
    refetchInterval: 3000,
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

export function useUpdateMemberHook() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: UserProfileType) =>
      await UpdateMemberAction(data.id as string, data),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["members"],
      });
      toast("Member updated successfully!");
    },
    onError: () => {
      console.error("Failed to update member.");
      toast.error("Failed to update member.");
    },
  });
}

export function useUpdateActiveStatusMemberHook() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      userID,
      status,
    }: {
      userID: string;
      status: number;
    }) => await UpdateActiveStatusMemberAction(userID, status),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["members"],
      });
      toast("Member updated successfully!");
    },
    onError: () => {
      console.error("Failed to update member.");
      toast.error("Failed to update member.");
    },
  });
}

export function useSelectAllMembersHook() {
  return useQuery({
    queryKey: ["members"],
    queryFn: async () => await SelectAllMembersAction(),
    refetchInterval: 3000,
    networkMode: "online",
  });
}

export function useSelectAllMembersByRoleHook(role: number) {
  return useQuery({
    queryKey: ["members", role],
    queryFn: async () => await SelectAllMembersByRoleAction(role),
    enabled: !!role,
    refetchInterval: 3000,
    networkMode: "online",
  });
}

// ASSIGNED PROJECTS HOOKS
export function useInsertFieldTechniciansToProjectHook(project_id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: string[]) =>
      await InsertFieldTechniciansToProjectAction(data, project_id),
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

export function useDeleteFieldTechnicianToProjectHook(projectID: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (userID: string) =>
      await DeleteFieldTechnicianFromProjectAction(userID, projectID),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["fieldTechnicians", projectID],
      });
      toast("Field technician removed from project successfully!");
    },
    onError: (error) => {
      console.error("Failed to remove field technician from project:", error);
      toast.error(`Failed to remove field technician: ${error.message}`);
    },
  });
}

export function useSelectFieldTechniciansByProjectIDHook(project_id: string) {
  return useQuery({
    queryKey: ["fieldTechnicians", project_id],
    queryFn: async () =>
      await SelectAllFieldTechniciansByProjectIDAction(project_id),
    enabled: !!project_id,
    refetchInterval: 3000,
    networkMode: "online",
  });
}

export function useSelectAssignedProjectsByFieldTechnicianHook() {
  return useQuery({
    queryKey: ["assignedProjectsByFieldTechnician"],
    queryFn: async () =>
      await SelectAllAssignedProjectsByFieldTechnicianIDAction(),
    refetchInterval: 3000,
    networkMode: "online",
  });
}

// LOCATION HOOKS
export function useUpdateUserCurrentLocationHook() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => await UpdateUserCurrentLocationAction(),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["userLocation"],
      });
      setInterval(() => {
        UpdateUserCurrentLocationAction();
      }, 10 * 60 * 1000);
    },
    onError: () => {
      UpdateUserCurrentLocationAction();
    },
  });
}

export function useSelectUserLocationHook(user_id: string) {
  return useQuery({
    queryKey: ["userLocation"],
    queryFn: async () => await SelectUserCurrentLocationAction(user_id),
    networkMode: "online",
  });
}

// ACTIVITY LOG HOOKS
export function useSelectActivityLogsByUserIDHook(user_id: string) {
  return useQuery({
    queryKey: ["activity-logs"],
    queryFn: async () => await SelectActivityLogsByUserIDAction(user_id),
    refetchInterval: 3000,
    networkMode: "online",
  });
}

export function useSelectActivityLogsByProjectIDHook(project_id: string) {
  return useQuery({
    queryKey: ["activity-logs", project_id],
    queryFn: async () => await SelectActivityLogsByProjectIDAction(project_id),
    refetchInterval: 3000,
    networkMode: "online",
  });
}

export function useSelectAllActivityLogsHook() {
  return useQuery({
    queryKey: ["activity-logs"],
    queryFn: async () => await SelectAllActivityLogsAction(),
    refetchInterval: 3000,
    networkMode: "online",
  });
}

export function useSelectAllActivityLogsByCurrentUserHook() {
  return useQuery({
    queryKey: ["activity-logs"],
    queryFn: async () => await SelectAllActivityLogsByCurrentUserAction(),
    refetchInterval: 3000,
    networkMode: "online",
  });
}

// DASHBOARD HOOKS
export function useSelectDashboardItemsHook(projectID: string) {
  return useQuery({
    queryKey: ["dashboard_items"],
    queryFn: async () => await SelectDashboardItemsAction(projectID),
    refetchInterval: 1000,
    networkMode: "online",
  });
}

export function useSelectUserDashboardItemsHook() {
  return useQuery({
    queryKey: ["dashboard_items"],
    queryFn: async () => await SelectUserDashboardItemsAction(),
    refetchInterval: 1000,
    networkMode: "online",
  });
}

export function useSelectAdminDashboardItemsHook() {
  return useQuery({
    queryKey: ["dashboard_items"],
    queryFn: async () => await SelectAdminDashboardItemsAction(),
    refetchInterval: 1000,
    networkMode: "online",
  });
}
