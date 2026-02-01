"use client";

import { FCAType } from "@/components/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  InsertFCAAction,
  SelectAllFCAAction,
  SelectAllFCAByStatusAction,
  EditFCAAction,
  SelectAllAssignedProjectsByFCAIDAction,
  EditFCAActiveStatusAction,
} from "../actions/FCAAction";

// FCA HOOKS
export function useInsertFCAHook() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: FCAType) => await InsertFCAAction(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["farmers"] });
      toast("FCA created successfully!");
    },
    onError: () => {
      toast.error(`Something went wrong. Please try again.`);
    },
  });
}

export function useSelectAllFCAHook() {
  return useQuery({
    queryKey: ["farmers", "all"],
    queryFn: async () => await SelectAllFCAAction(),
    refetchInterval: 30000, // Reduced from 3s to 30s for better performance
    networkMode: "online",
  });
}

export function useSelectAllFCAByStatusHook(status: number) {
  return useQuery({
    queryKey: ["farmers", "byStatus", status],
    queryFn: async () => await SelectAllFCAByStatusAction(status),
    enabled: status !== undefined,
    refetchInterval: 30000, // Reduced from 3s to 30s for better performance
    networkMode: "online",
  });
}

export function useEditFCAHook() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: FCAType) => await EditFCAAction(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["farmers"] });
      toast("FCA updated successfully!");
    },
    onError: () => {
      toast.error(`Something went wrong. Please try again.`);
    },
  });
}

export function useEditFCAActiveStatusHook() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ fcaID, status }: { fcaID: string; status: number }) =>
      await EditFCAActiveStatusAction(fcaID, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["farmers"] });
      toast("FCA updated successfully!");
    },
    onError: () => {
      toast.error(`Something went wrong. Please try again.`);
    },
  });
}

export function useSelectAllAssignedProjectsByFCAIDHook(fcaID: string) {
  return useQuery({
    queryKey: ["assignedProjectsByFCA", fcaID],
    queryFn: async () => await SelectAllAssignedProjectsByFCAIDAction(fcaID),
    enabled: !!fcaID,
    refetchInterval: 30000, // Reduced from 3s to 30s for better performance
    networkMode: "online",
  });
}
