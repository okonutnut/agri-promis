"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery, useQueryClient, NetworkMode } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";

export type ConnectionStatus = "connecting" | "connected" | "disconnected" | "error";

type UseRealtimeQueryProps<T> = {
  queryKey: (string | number)[];
  table: string;
  queryFn: () => Promise<T>;
  schema?: string;
  staleTime?: number;
  refetchInterval?: number;
  networkMode?: NetworkMode;
  retryAttempts?: number;
  retryDelay?: number;
};

export function useRealtimeQuery<T>({
  queryKey,
  table,
  queryFn,
  schema = "public",
  staleTime = 30_000,
  refetchInterval,
  networkMode = "online",
  retryAttempts = 5,
  retryDelay = 1000,
}: UseRealtimeQueryProps<T>) {
  const queryClient = useQueryClient();
  const supabase = useMemo(() => createClient(), []);
  const queryKeySerialized = useMemo(
    () => JSON.stringify(queryKey),
    [queryKey],
  );
  const stableQueryKey = useMemo(() => queryKey, [queryKeySerialized]);

  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>("disconnected");
  const retryCountRef = useRef(0);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const connectionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
  const isUnmountedRef = useRef(false);

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
    isUnmountedRef.current = false;

    function attemptSubscribe() {
      if (channelRef.current || !navigator.onLine) return;

      setConnectionStatus("connecting");

      connectionTimeoutRef.current = setTimeout(() => {
        if (!channelRef.current && !isUnmountedRef.current) {
          setConnectionStatus("error");
          reconnect();
        }
      }, 10000);

      channelRef.current = supabase
        .channel(`${table}-changes`)
        .on("postgres_changes", { event: "*", schema, table }, (payload) => {
          const eventType = payload.eventType as string;
          
          // For UPDATE/INSERT/DELETE events, refetch to ensure RLS compliance
          if (eventType === "UPDATE" || eventType === "INSERT" || eventType === "DELETE") {
            queryClient.refetchQueries({ queryKey: stableQueryKey });
            return;
          }
          
          // For DELETE, update cache directly
          if (eventType === "DELETE") {
            queryClient.setQueryData<T | T[]>(queryKey, (old) => {
              if (!old || !Array.isArray(old)) return old;
              const oldId = (payload.old as any)?.id;
              if (!oldId) return old;
              return old.filter((row: any) => row.id !== oldId) as T[];
            });
            return;
          }
        })
        .subscribe((status) => {
          if (isUnmountedRef.current) return;

          if (connectionTimeoutRef.current) {
            clearTimeout(connectionTimeoutRef.current);
            connectionTimeoutRef.current = null;
          }

          if (status === "SUBSCRIBED") {
            setConnectionStatus("connected");
            retryCountRef.current = 0;
          } else if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
            setConnectionStatus("error");
            reconnect();
          } else if (status === "CLOSED") {
            setConnectionStatus("disconnected");
          } else if (status === "SYNC_ERROR") {
            setConnectionStatus("error");
            reconnect();
          }
        });
    }

    function reconnect() {
      if (retryCountRef.current >= retryAttempts) {
        setConnectionStatus("error");
        return;
      }

      const delay = retryDelay * Math.pow(2, retryCountRef.current);
      retryCountRef.current += 1;
      setConnectionStatus("connecting");

      retryTimeoutRef.current = setTimeout(() => {
        if (!isUnmountedRef.current && navigator.onLine) {
          setConnectionStatus("disconnected");
          attemptSubscribe();
        }
      }, delay);
    }

    function unsubscribe() {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
        retryTimeoutRef.current = null;
      }
      if (connectionTimeoutRef.current) {
        clearTimeout(connectionTimeoutRef.current);
        connectionTimeoutRef.current = null;
      }
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    }

    if (navigator.onLine) {
      attemptSubscribe();
    } else {
      setConnectionStatus("disconnected");
    }

    const handleOnline = () => {
      queryClient.invalidateQueries({ queryKey: stableQueryKey });
      unsubscribe();
      retryCountRef.current = 0;
      attemptSubscribe();
    };

    const handleOffline = () => {
      setConnectionStatus("disconnected");
      unsubscribe();
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      isUnmountedRef.current = true;
      unsubscribe();
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [queryClient, stableQueryKey, table, schema, supabase, retryAttempts, retryDelay]);

  return { ...query, connectionStatus };
}
