"use client";

import { createClient } from "@/utils/supabase/client";
import { NetworkMode, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";

type UseUniversalRealtimeOptions<T> = {
  queryKey: (string | number)[];
  queryFn: () => Promise<T>; // usually your server action
  tables: string[]; // tables to subscribe to
  staleTime?: number;
  networkMode?: NetworkMode;
};

/**
 * Universal hook: fetch via Server Action + sync via Supabase Realtime + handle network mode
 */
export function useUniversalRealtime<T>({
  queryKey,
  queryFn,
  tables,
  staleTime = 30_000,
  networkMode = "online",
}: UseUniversalRealtimeOptions<T>) {
  const supabase = useMemo(() => createClient(), []);
  const queryClient = useQueryClient();
  const realtimeTablesKey = useMemo(() => tables.join("|"), [tables]);
  const queryKeySerialized = useMemo(
    () => JSON.stringify(queryKey),
    [queryKey],
  );
  const stableTables = useMemo(() => tables, [realtimeTablesKey]);
  const stableQueryKey = useMemo(() => queryKey, [queryKeySerialized]);

  // Main query
  const query = useQuery<T>({
    queryKey,
    queryFn,
    staleTime,
    refetchOnWindowFocus: false,
    networkMode,
  });

  // Realtime + network awareness
  useEffect(() => {
    if (typeof window === "undefined") return;

    let channels: ReturnType<typeof supabase.channel>[] = [];

    function subscribe() {
      // Don't subscribe if already subscribed
      if (channels.length > 0) return;

      channels = stableTables.map((table) =>
        supabase
          .channel(`realtime:${table}`)
          .on(
            "postgres_changes",
            { event: "*", schema: "public", table },
            () => {
              queryClient.invalidateQueries({ queryKey: stableQueryKey });
            },
          )
          .subscribe(),
      );
    }

    function unsubscribe() {
      channels.forEach((ch) => supabase.removeChannel(ch));
      channels = [];
    }

    // Subscribe when online
    if (navigator.onLine) {
      subscribe();
    }

    // Handle network changes
    const handleOnline = () => {
      queryClient.invalidateQueries({ queryKey: stableQueryKey }); // refresh on reconnect
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
  }, [
    supabase,
    queryClient,
    stableQueryKey,
    stableTables,
    queryKeySerialized,
    realtimeTablesKey,
  ]);

  return query;
}
