"use client";

import { useEffect, useMemo } from "react";
import { useQuery, useQueryClient, NetworkMode } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";

type UseRealtimeQueryProps<T> = {
  queryKey: (string | number)[];
  table: string;
  queryFn: () => Promise<T>;
  schema?: string;
  staleTime?: number;
  refetchInterval?: number;
  networkMode?: NetworkMode;
};

export function useRealtimeQuery<T>({
  queryKey,
  table,
  queryFn,
  schema = "public",
  staleTime = 30_000,
  refetchInterval,
  networkMode = "online",
}: UseRealtimeQueryProps<T>) {
  const queryClient = useQueryClient();
  const supabase = useMemo(() => createClient(), []);
  const queryKeySerialized = useMemo(
    () => JSON.stringify(queryKey),
    [queryKey],
  );
  const stableQueryKey = useMemo(() => queryKey, [queryKeySerialized]);

  const query = useQuery<T>({
    queryKey: stableQueryKey,
    queryFn,
    staleTime,
    refetchInterval,
    networkMode,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    let channel: ReturnType<typeof supabase.channel> | null = null;

    function subscribe() {
      if (!navigator.onLine || channel) return;

      channel = supabase
        .channel(`${table}-changes`)
        .on("postgres_changes", { event: "*", schema, table }, (payload) => {
          queryClient.setQueryData<T | T[]>(queryKey, (old) => {
            if (!old) return old;

            // If old is an array → patch snappily
            if (Array.isArray(old)) {
              switch (payload.eventType) {
                case "INSERT":
                  return [...old, payload.new] as T[];
                case "UPDATE":
                  return old.map((row: any) =>
                    row.id === payload.new.id ? payload.new : row,
                  ) as T[];
                case "DELETE":
                  return old.filter(
                    (row: any) => row.id !== payload.old.id,
                  ) as T[];
                default:
                  return old;
              }
            }

            // If old is a single object → safer to refetch
            queryClient.invalidateQueries({ queryKey: stableQueryKey });
            return old;
          });
        })
        .subscribe();
    }

    function unsubscribe() {
      if (channel) {
        supabase.removeChannel(channel);
        channel = null;
      }
    }

    // Subscribe when online
    if (navigator.onLine) {
      subscribe();
    }

    // Handle online/offline events
    const handleOnline = () => {
      // Refetch when coming back online
      queryClient.invalidateQueries({ queryKey: stableQueryKey });
      subscribe();
    };

    const handleOffline = () => {
      unsubscribe();
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      unsubscribe();
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [queryClient, stableQueryKey, table, schema, supabase]);

  return query;
}
