"use client";

import { FCAType } from "@/components/types";
import { useMutation, useQuery } from "@tanstack/react-query";
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
  return useMutation({
    mutationFn: async (data: FCAType) => await InsertFCAAction(data),
    onSuccess: () => {
      toast("FCA created successfully!");
    },
    onError: (error) => {
      toast.error(`Failed to create FCA: ${error.message}`);
    },
  });
}

export function useSelectAllFCAHook() {
  return useQuery({
    queryKey: ["farmers"],
    queryFn: async () => await SelectAllFCAAction(),
    refetchInterval: 3000,
    networkMode: "online",
  });
}

export function useSelectAllFCAByStatusHook(status: number) {
  return useQuery({
    queryKey: ["farmers"],
    queryFn: async () => await SelectAllFCAByStatusAction(status),
    refetchInterval: 3000,
    networkMode: "online",
  });
}

export function useEditFCAHook() {
  return useMutation({
    mutationFn: async (data: FCAType) => await EditFCAAction(data),
    onSuccess: () => {
      toast("FCA updated successfully!");
    },
    onError: (error) => {
      toast.error(`Failed to update FCA: ${error.message}`);
    },
  });
}

export function useEditFCAActiveStatusHook() {
  return useMutation({
    mutationFn: async ({ fcaID, status }: { fcaID: string; status: number }) =>
      await EditFCAActiveStatusAction(fcaID, status),
    onSuccess: () => {
      toast("FCA updated successfully!");
    },
    onError: (error) => {
      toast.error(`Failed to update FCA: ${error.message}`);
    },
  });
}

export function useSelectAllAssignedProjectsByFCAIDHook(fcaID: string) {
  return useQuery({
    queryKey: ["assignedProjectsByFCA", fcaID],
    queryFn: async () => await SelectAllAssignedProjectsByFCAIDAction(fcaID),
    refetchInterval: 3000,
    networkMode: "online",
  });
}
