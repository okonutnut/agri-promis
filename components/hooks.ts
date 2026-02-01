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
import { SelectUserCurrentLocationAction } from "@/app/actions/UserSessionAction";
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
  SelectProjectDetailsByProjectLocationIDAction,
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
  ProjectLocationType,
  ProjectType,
  TravelOrderType,
  UserProfileType,
} from "./types";
import { InsertProjectLocationAction } from "@/app/actions/ProjectLocationAction";

// PROGRAM HOOKS
export function useSelectProgramByIDHook(programId: string) {
  return useQuery({
    queryKey: ["programById", programId],
    queryFn: async () => await SelectProgramByIdAction(programId),
    enabled: !!programId,
    refetchInterval: 30000, // Reduced from 3s to 30s for better performance
    networkMode: "online",
  });
}

export function useSelectAllProgramsByAgriculturistHook() {
  return useQuery({
    queryKey: ["allProgramsByAgriculturist"],
    queryFn: async () => await SelectAllProgramsByAgriculturistAction(),
    refetchInterval: 30000, // Reduced from 3s to 30s for better performance
    networkMode: "online",
  });
}

export function useSelectAllProgramsByUserIDHook(userID: string) {
  return useQuery({
    queryKey: ["allProgramsByUserId", userID],
    queryFn: async () => await SelectAllProgramsByUserIDAction(userID),
    enabled: !!userID,
    refetchInterval: 30000, // Reduced from 3s to 30s for better performance
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
      window.location.href = `/dashboard/programs/${data?.id}`;
    },
    onError: () => {
      toast.error("Something went wrong. Please try again.");
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
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: ["programById", variables.id] });
      qc.invalidateQueries({ queryKey: ["allProgramsByAgriculturist"] });
      toast("Program name updated successfully!");
    },
    onError: () => {
      toast.error("Something went wrong. Please try again.");
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
      window.location.href = `/dashboard/programs`;
    },
    onError: () => {
      toast.error("Something went wrong. Please try again.");
    },
  });
}

export function useSelectAllProgramsHook() {
  return useQuery({
    queryKey: ["programs", "all"],
    queryFn: async () => await SelectAllProgramsAction(),
    refetchInterval: 30000, // Reduced from 3s to 30s for better performance
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
    queryKey: ["allProjectsByProgramId", programId],
    queryFn: async () => await SelectAllProjectsByProgramIDAction(programId),
    enabled: !!programId,
    refetchInterval: 30000, // Reduced from 3s to 30s for better performance
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
    queryKey: ["programAndProjectDetailsByProjectId", projectId],
    queryFn: async () =>
      await SelectProgramAndProjectDetailsByProjectIDAction(projectId),
    enabled: !!projectId,
    refetchInterval: 30000, // Reduced from 3s to 30s for better performance
    networkMode: "online",
  });
}

export function useSelectProjectDetailsHook(projectId: string) {
  return useQuery({
    queryKey: ["projectDetails", projectId],
    queryFn: async () =>
      await SelectProjectDetailsByProjectLocationIDAction(projectId),
    enabled: !!projectId,
    refetchInterval: 30000, // Reduced from 3s to 30s for better performance
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
      window.location.href = `/dashboard/programs/${data?.program_id}`;
    },
    onError: () => {
      toast.error("Something went wrong. Please try again.", {
        duration: 2000,
      });
    },
  });
}

export function useInsertProjectLocationHook() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (data: ProjectLocationType) =>
      await InsertProjectLocationAction(data),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["allProjectsByProgramId"],
      });
      toast("Project location added successfully!");
    },
    onError: () => {
      toast.error("Something went wrong. Please try again.", {
        duration: 2000,
      });
    },
  });
}

export function useEditProjectHook() {
  const qc = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: ProjectType) => await EditProjectAction(data),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: ["allProjectsByProgramId"] });
      qc.invalidateQueries({ queryKey: ["projectDetails", variables.id] });
      toast("Project updated successfully!");
    },
    onError: () => {
      toast.error("Something went wrong. Please try again.");
    },
  });
}

export function useDeleteProjectHook(projectId: string, programId: string) {
  const qc = useQueryClient();
  
  return useMutation({
    mutationFn: async () => await DeleteProjectAction(projectId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["allProjectsByProgramId", programId] });
      toast.success("Project deleted successfully!");
      window.location.href = `/dashboard/programs/${programId}`;
    },
    onError: () => {
      toast.error("Something went wrong. Please try again.");
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
        queryKey: ["travel_order"],
      });
      toast("Travel order issued successfully!");
    },
    onError: () => {
      toast.error("Something went wrong. Please try again.");
    },
  });
}

export function useSelectAllTravelOrdersByUserIDHook(user_id?: string) {
  return useQuery({
    queryKey: ["travel_order", "byUser", user_id],
    queryFn: async () => await SelectAllTravelOrdersByUserIDAction(user_id),
    enabled: !!user_id,
    refetchInterval: 30000, // Reduced from 3s to 30s for better performance
    networkMode: "online",
  });
}

export function useSelectAllTravelOrdersByProgramIDHook(programID: string) {
  return useQuery({
    queryKey: ["travel_order", "byProgram", programID],
    queryFn: async () =>
      await SelectAllTravelOrdersByProgramIDAction(programID),
    enabled: !!programID,
    refetchInterval: 30000, // Reduced from 3s to 30s for better performance
    networkMode: "online",
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
    refetchInterval: 30000, // Reduced from 3s to 30s for better performance
    networkMode: "online",
  });
}

export function useInsertMonitoringReportHook() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: MonitoringReportType) =>
      await InsertMonitoringReportAction(data),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({
        queryKey: ["allMonitoringReportsByProjectId", variables.project_id],
      });
      qc.invalidateQueries({
        queryKey: ["allMonitoringReportsByUser"],
      });
      toast("Monitoring report created successfully!");
    },
    onError: () => {
      toast.error("Something went wrong. Please try again.");
    },
  });
}

export function useInsertRemarksInMonitoringReportHook(reportId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () =>
      await InsertRemarksInMonitoringReportAction(reportId),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["allMonitoringReportsByProjectId"],
      });
      qc.invalidateQueries({
        queryKey: ["allMonitoringReportsByUser"],
      });
      toast("Remarks added successfully!");
    },
    onError: () => {
      toast.error("Something went wrong. Please try again.");
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
    enabled: !!projectID,
    refetchInterval: 30000, // Reduced from 3s to 30s for better performance
    networkMode: "online",
  });
}

export function useSelectAllMonitoringReportsByCurrentUserHook() {
  return useQuery({
    queryKey: ["allMonitoringReportsByUser", "current"],
    queryFn: async () => await SelectAllMonitoringReportsByCurrentUserAction(),
    refetchInterval: 30000, // Reduced from 3s to 30s for better performance
    networkMode: "online",
  });
}

// MEMBER HOOKS
export function useInsertMemberHook() {
  const qc = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: UserProfileType) => await InsertMemberAction(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["members"] });
      toast("Member invited successfully!");
    },
    onError: () => {
      console.error("Failed to invite member.");
      toast.error("Something went wrong. Please try again.");
    },
  });
}

export function useUpdateMemberHook() {
  const qc = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: UserProfileType) =>
      await UpdateMemberAction(data.id as string, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["members"] });
      toast("Member updated successfully!");
    },
    onError: () => {
      toast.error("Something went wrong. Please try again.");
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
      toast.error("Something went wrong. Please try again.");
    },
  });
}

export function useSelectAllMembersHook() {
  return useQuery({
    queryKey: ["members", "all"],
    queryFn: async () => await SelectAllMembersAction(),
    refetchInterval: 30000, // Reduced from 3s to 30s for better performance
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
      qc.invalidateQueries({ queryKey: ["project-field-technicians"] });
      toast("Field technician added to project successfully!");
    },
    onError: () => {
      console.error("Failed to add field technician to project.");
      toast.error("Something went wrong. Please try again.");
    },
  });
}

export function useDeleteFieldTechnicianToProjectHook(projectID: string) {
  const qc = useQueryClient();
  
  return useMutation({
    mutationFn: async (userID: string) =>
      await DeleteFieldTechnicianFromProjectAction(userID, projectID),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["fieldTechnicians", projectID] });
      toast("Field technician removed from project successfully!");
    },
    onError: () => {
      console.error("Failed to remove field technician from project.");
      toast.error("Something went wrong. Please try again.");
    },
  });
}

export function useSelectFieldTechniciansByProjectIDHook(project_id: string) {
  return useQuery({
    queryKey: ["fieldTechnicians", project_id],
    queryFn: async () =>
      await SelectAllFieldTechniciansByProjectIDAction(project_id),
    enabled: !!project_id,
    refetchInterval: 30000, // Reduced from 3s to 30s for better performance
    networkMode: "online",
  });
}

export function useSelectAssignedProjectsByFieldTechnicianHook() {
  return useQuery({
    queryKey: ["assignedProjectsByFieldTechnician", "current"],
    queryFn: async () =>
      await SelectAllAssignedProjectsByFieldTechnicianIDAction(),
    refetchInterval: 30000, // Reduced from 3s to 30s for better performance
    networkMode: "online",
  });
}

// LOCATION HOOKS
export function useSelectUserLocationHook(user_id: string) {
  return useQuery({
    queryKey: ["userLocation", user_id],
    queryFn: async () => await SelectUserCurrentLocationAction(user_id),
    enabled: !!user_id,
    networkMode: "online",
  });
}

// ACTIVITY LOG HOOKS
export function useSelectActivityLogsByUserIDHook(user_id: string) {
  return useQuery({
    queryKey: ["activity-logs", "byUser", user_id],
    queryFn: async () => await SelectActivityLogsByUserIDAction(user_id),
    enabled: !!user_id,
    refetchInterval: 30000, // Reduced from 3s to 30s for better performance
    networkMode: "online",
  });
}

export function useSelectActivityLogsByProjectIDHook(project_id: string) {
  return useQuery({
    queryKey: ["activity-logs", "byProject", project_id],
    queryFn: async () => await SelectActivityLogsByProjectIDAction(project_id),
    enabled: !!project_id,
    refetchInterval: 30000, // Reduced from 3s to 30s for better performance
    networkMode: "online",
  });
}

export function useSelectAllActivityLogsHook() {
  return useQuery({
    queryKey: ["activity-logs", "all"],
    queryFn: async () => await SelectAllActivityLogsAction(),
    refetchInterval: 30000, // Reduced from 3s to 30s for better performance
    networkMode: "online",
  });
}

export function useSelectAllActivityLogsByCurrentUserHook() {
  return useQuery({
    queryKey: ["activity-logs", "currentUser"],
    queryFn: async () => await SelectAllActivityLogsByCurrentUserAction(),
    refetchInterval: 30000, // Reduced from 3s to 30s for better performance
    networkMode: "online",
  });
}

// DASHBOARD HOOKS
export function useSelectDashboardItemsHook(projectID: string) {
  return useQuery({
    queryKey: ["dashboard_items", "byProject", projectID],
    queryFn: async () => await SelectDashboardItemsAction(projectID),
    enabled: !!projectID,
    refetchInterval: 30000, // Reduced from 1s to 30s - dashboard doesn't need 1s polling
    networkMode: "online",
  });
}

export function useSelectUserDashboardItemsHook() {
  return useQuery({
    queryKey: ["dashboard_items", "user"],
    queryFn: async () => await SelectUserDashboardItemsAction(),
    refetchInterval: 30000, // Reduced from 1s to 30s - dashboard doesn't need 1s polling
    networkMode: "online",
  });
}

export function useSelectAdminDashboardItemsHook() {
  return useQuery({
    queryKey: ["dashboard_items", "admin"],
    queryFn: async () => await SelectAdminDashboardItemsAction(),
    refetchInterval: 30000, // Reduced from 1s to 30s - dashboard doesn't need 1s polling
    networkMode: "online",
  });
}
