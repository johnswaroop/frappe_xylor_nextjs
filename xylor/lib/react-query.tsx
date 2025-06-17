"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";

export function ReactQueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Don't refetch on window focus by default
            refetchOnWindowFocus: false,
            // Retry failed requests
            retry: (failureCount, error) => {
              // Don't retry on 401/403 errors
              if (error instanceof Error && error.message.includes("401"))
                return false;
              if (error instanceof Error && error.message.includes("403"))
                return false;
              // Retry up to 3 times for other errors
              return failureCount < 3;
            },
            // Default stale time
            staleTime: 30 * 1000, // 30 seconds
            // Cache time
            gcTime: 5 * 60 * 1000, // 5 minutes (formerly cacheTime)
          },
          mutations: {
            retry: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
