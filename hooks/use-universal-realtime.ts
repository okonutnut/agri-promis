"use client";

import { createClient } from "@/utils/supabase/client";
import { NetworkMode, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export type ConnectionStatus = "connecting" | "connected" | "disconnected" | "error";

type UseUniversalRealtimeOptions<T> = {
  queryKey: (string | number)[];
  queryFn: () => Promise<T>;
  tables: string[];
  staleTime?: number;
  networkMode?: NetworkMode;
  retryAttempts?: number;
  retryDelay?: number;
};

/**
 * Universal hook: fetch via Server Action + sync via Supabase Realtime + handle network mode
 * Uses a single channel with multiple .on() listeners instead of one channel per table.
 */
export function useUniversalRealtime<T>({
  queryKey,
  queryFn,
  tables,
  staleTime = 30_000,
  networkMode = "online",
  retryAttempts = 5,
  retryDelay = 1000,
}: UseUniversalRealtimeOptions<T>) {
  const supabase = useMemo(() => createClient(), []);
  const queryClient = useQueryClient();
  const realtimeTablesKey = useMemo(() => tables.join("|"), [tables]);
  const queryKeySerialized = useMemo(() => JSON.stringify(queryKey), [queryKey]);
  const stableTables = useMemo(() => tables, [realtimeTablesKey]);
  const stableQueryKey = useMemo(() => queryKey, [queryKeySerialized]);

  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>("disconnected");
  const retryCountRef = useRef(0);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  // Single channel ref instead of array
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
  const isUnmountedRef = useRef(false);

  const query = useQuery<T>({
    queryKey,
    queryFn,
    staleTime,
    refetchOnWindowFocus: false,
    networkMode,
  });

  const clearRetryTimeout = useCallback(() => {
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    isUnmountedRef.current = false;

    function attemptSubscribe() {
      if (channelRef.current || !navigator.onLine) return;

      setConnectionStatus("connecting");

      // Build a single channel and attach one .on() listener per table
      const channelName = `realtime:${stableTables.join("+")}`;
      let channel = supabase.channel(channelName);

      stableTables.forEach((table) => {
        channel = channel.on(
          "postgres_changes",
          { event: "*", schema: "public", table },
          () => {
            queryClient.invalidateQueries({ queryKey: stableQueryKey });
          },
        );
      });

      channelRef.current = channel.subscribe((status) => {
        if (isUnmountedRef.current) return;

        if (status === "SUBSCRIBED") {
          setConnectionStatus("connected");
          retryCountRef.current = 0;
        } else if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
          setConnectionStatus("error");
          reconnect();
        } else if (status === "CLOSED") {
          setConnectionStatus("disconnected");
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
      clearRetryTimeout();
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
  }, [
    supabase,
    queryClient,
    stableQueryKey,
    stableTables,
    queryKeySerialized,
    realtimeTablesKey,
    retryAttempts,
    retryDelay,
    clearRetryTimeout,
  ]);

  return { ...query, connectionStatus };
}