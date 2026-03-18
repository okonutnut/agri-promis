"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { PropsWithChildren } from "react";

export default function ReactQueryProvider({
  children,
}: PropsWithChildren<object>) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30 * 1000,        // 30s — realtime handles freshness
            gcTime: 5 * 60 * 1000,       // Keep in cache for 5 minutes
            refetchOnWindowFocus: false,  // Realtime handles this
            refetchOnReconnect: true,     // Refetch when network reconnects
            refetchOnMount: false,        // Realtime handles this — avoid double fetch on mount
            networkMode: "online",
            retry: (failureCount, error: any) => {
              if (!navigator.onLine) return false;
              if (error?.status >= 400 && error?.status < 500) return false;
              return failureCount < 3;
            },
          },
        },
      })
  );

  useEffect(() => {
    const handleOnline = () => {
      // invalidateQueries instead of refetchQueries — only refetches actively observed queries
      client.invalidateQueries();
    };

    window.addEventListener("online", handleOnline);
    return () => window.removeEventListener("online", handleOnline);
  }, [client]);

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}