"use client";

import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";

export function useSupabaseSession() {
  const queryClient = useQueryClient();
  const supabase = createClient();

  // First load (recover session if it exists)
  const query = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const { data } = await supabase.auth.getSession();
      return data.session;
    },
    staleTime: 0,
  });

  useEffect(() => {
    // Listen for auth state changes (login, logout, token refresh)
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        queryClient.setQueryData(["session"], session);
      }
    );

    // Listen for localStorage changes (multi-tab sync)
    const syncSession = (e: StorageEvent) => {
      if (e.key === "supabase.auth.token") {
        const newSession = e.newValue ? JSON.parse(e.newValue) : null;
        queryClient.setQueryData(
          ["session"],
          newSession?.currentSession ?? null
        );
      }
    };
    window.addEventListener("storage", syncSession);

    return () => {
      listener.subscription.unsubscribe();
      window.removeEventListener("storage", syncSession);
    };
  }, [queryClient]);

  return query;
}
