import { createClient } from "@/utils/supabase/client";
import { useQuery } from "@tanstack/react-query";
import {
  SelectAllUserProfilesAction,
  SelectUserProfileAction,
} from "../actions/UserProfileAction";

// USER PROFILE HOOKS
export function useSelectAllUserProfilesHook() {
  return useQuery({
    queryKey: ["userProfiles", "all"],
    queryFn: async () => await SelectAllUserProfilesAction(),
    refetchInterval: 30000, // Reduced from 3s to 30s for better performance
    networkMode: "online",
  });
}

export function useSelectUserProfileHook() {
  return useQuery({
    queryKey: ["userProfile", "current"],
    queryFn: async () => await SelectUserProfileAction(),
    refetchInterval: 60000, // Reduced from 3s to 60s - user profile changes less frequently
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
    networkMode: "online",
  });
}
