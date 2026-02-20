"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

interface UseUniversalMutationProps<TBody, TResponse> {
  mutationFn: (body: TBody) => Promise<TResponse>;
  invalidateKeys?: string[];
  onSuccess?: (data: TResponse) => void;
  onError?: (error: unknown) => void;
}

export function useUniversalMutation<TBody, TResponse>({
  mutationFn,
  invalidateKeys = [],
  onSuccess,
  onError,
}: UseUniversalMutationProps<TBody, TResponse>) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn,
    onSuccess: (data) => {
      invalidateKeys.forEach((key) => {
        queryClient.invalidateQueries({ queryKey: [key] });
      });
      if (onSuccess) {
        onSuccess(data);
      }
    },
    onError: (error) => {
      if (onError) {
        onError(error);
      }
    },
  });

  return {
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
  };
}
