import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { InsertLocationAction, SelectAllLocationsAction } from "./actions";
import { LocationType } from "./types";
import { toast } from "sonner";

export function InsertLocationHook() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: LocationType) => await InsertLocationAction(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["locations"] });
      toast.success("Location added successfully", {
        position: "bottom-right",
      });
    },
    onError: (error: any) => {
      console.error("Error inserting location:", error);
      toast.error("Failed to add location", {
        position: "bottom-right",
      });
    },
  });
}

export function SelectAllLocationHook() {
  return useQuery({
    queryKey: ["locations"],
    queryFn: async () => await SelectAllLocationsAction(),
    refetchOnWindowFocus: false,
    retry: 1,
  });
}
