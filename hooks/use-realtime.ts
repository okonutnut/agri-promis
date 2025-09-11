"use client";

import { useEffect } from "react";
import { useQuery, useQueryClient, NetworkMode } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";

type UseRealtimeQueryProps<T> = {
  queryKey: (string | number)[];
  table: string;
  queryFn: () => Promise<T>; // supports single or array
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
  staleTime = 1000 * 60,
  refetchInterval = 600000,
  networkMode = "online",
}: UseRealtimeQueryProps<T>) {
  const queryClient = useQueryClient();
  const supabase = createClient();

  const query = useQuery<T>({
    queryKey,
    queryFn,
    staleTime,
    refetchInterval,
    networkMode,
  });

  useEffect(() => {
    const channel = supabase
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
                  row.id === payload.new.id ? payload.new : row
                ) as T[];
              case "DELETE":
                return old.filter(
                  (row: any) => row.id !== payload.old.id
                ) as T[];
              default:
                return old;
            }
          }

          // If old is a single object → safer to refetch
          queryClient.invalidateQueries({ queryKey });
          return old;
        });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient, queryKey, table, schema]);

  return query;
}
