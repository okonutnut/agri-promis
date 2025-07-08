// components/ReactQueryProvider.tsx
"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { PropsWithChildren } from "react";

export default function ReactQueryProvider({
  children,
}: PropsWithChildren<object>) {
  const [client] = useState(
    () =>
      new QueryClient({ defaultOptions: { queries: { staleTime: 60_000 } } })
  );
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
