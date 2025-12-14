// components/ReactQueryProvider.tsx
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
            staleTime: 0, // Data is always stale - always try to fetch fresh
            gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes (formerly cacheTime)
            refetchOnWindowFocus: true, // Refetch when window regains focus
            refetchOnReconnect: true, // Refetch when network reconnects
            refetchOnMount: true, // Always refetch on mount when online
            networkMode: "online", // Only run queries when online
            retry: (failureCount, error: any) => {
              // Don't retry if offline or if it's a 4xx error
              if (!navigator.onLine) return false;
              if (error?.status >= 400 && error?.status < 500) return false;
              return failureCount < 3;
            },
          },
        },
      })
  );

  // Handle online/offline events
  useEffect(() => {
    const handleOnline = () => {
      // Refetch all queries when coming back online
      client.refetchQueries();
    };

    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("online", handleOnline);
    };
  }, [client]);

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
