import {useMutation} from "@tanstack/react-query";
import {PrimitiveAtom} from "jotai";
import {declineInstructions, InstructionState} from "@/instructions/shared/instruction-state";

export function useDeclineWorkflowMutation() {
  return useMutation({
    mutationFn: async (instructionsStateAtom: PrimitiveAtom<InstructionState[]>) => {
      declineInstructions(instructionsStateAtom);
    }
  })
}
