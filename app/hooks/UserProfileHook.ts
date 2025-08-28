import { createClient } from "@/utils/supabase/client";
import { useQuery } from "@tanstack/react-query";
import {
  SelectAllUserProfilesAction,
  SelectUserProfileAction,
} from "../actions/UserProfileAction";

// USER PROFILE HOOKS
export function useSelectAllUserProfilesHook() {
  return useQuery({
    queryKey: ["userProfiles"],
    queryFn: async () => await SelectAllUserProfilesAction(),
    refetchInterval: 3000,
    networkMode: "online",
  });
}

export function useSelectUserProfileHook() {
  return useQuery({
    queryKey: ["userProfile"],
    queryFn: async () => await SelectUserProfileAction(),
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
    networkMode: "online",
  });
}
