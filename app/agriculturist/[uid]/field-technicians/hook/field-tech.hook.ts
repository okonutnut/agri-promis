import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { UserProfile } from "../types";

export function useFetchAllFieldTechnician() {
  return useQuery({
    queryKey: ["fieldTechnicians"],
    queryFn: async () => {
      const response = await axios.get<UserProfile[]>("/api/field_tech");
      if (response.status !== 200) {
        throw new Error("Failed to fetch field technicians");
      }
      return response.data;
    },
  });
}
