import {useMutation} from "@tanstack/react-query";

export function useRunWorkflowMutation() {
  return useMutation({
    mutationFn: (execute: () => Promise<void>) => execute(),
  })
}
