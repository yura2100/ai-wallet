import {store} from "@/store/store-provider";
import {atom, PrimitiveAtom} from "jotai";
import {StepState} from "@/instructions/shared/step-state";

export type InstructionStatus = "idle" | "in-progress" | "successfull" | "failed" | "aborted";
export type InstructionState = {
  id: string;
  status: InstructionStatus;
  steps: PrimitiveAtom<StepState[]>;
};

export function buildInstructionsStateAtom(params: { id: string; steps: PrimitiveAtom<StepState[]> }[]) {
  const instructions: InstructionState[] = params.map(({ id, steps }) => ({id, steps, status: "idle"}));
  return atom(instructions);
}

export function successInstruction(instructions: PrimitiveAtom<InstructionState[]>, id: string) {
  const existingInstructions = store.get(instructions);
  const currentInstruction = existingInstructions.find((instruction) => instruction.id === id);
  if (!currentInstruction || currentInstruction.status !== "in-progress") return false;

  const updatedInstructions: InstructionState[] = existingInstructions.map((instruction) => {
    if (instruction.id !== id) return instruction;
    return {...instruction, status: "successfull"};
  });
  store.set(instructions, updatedInstructions);
  return true;
}

export function failInstruction(instructions: PrimitiveAtom<InstructionState[]>, id: string) {
  const existingInstructions = store.get(instructions);
  const currentInstruction = existingInstructions.find((instruction) => instruction.id === id);
  if (!currentInstruction || currentInstruction.status !== "in-progress") return false;

  const failedInstructionIndex = existingInstructions.findIndex((instruction) => instruction.id === id);
  const updatedInstructions: InstructionState[] = existingInstructions.map((instruction, index) => {
    if (index < failedInstructionIndex) return instruction;
    if (instruction.id === id) return {...instruction, status: "failed"};

    // Mutate the steps of the failed instruction
    const steps = store.get(instruction.steps);
    const updatedSteps: StepState[] = steps.map((step) => ({ ...step, status: "aborted" }));
    store.set(instruction.steps, updatedSteps);

    return {...instruction, status: "aborted"};
  });
  store.set(instructions, updatedInstructions);
  return true;
}

export function inProgressInstruction(instructions: PrimitiveAtom<InstructionState[]>, id: string) {
  const existingInstructions = store.get(instructions);
  const currentInstruction = existingInstructions.find((instruction) => instruction.id === id);
  if (!currentInstruction || currentInstruction.status !== "idle") return false;

  const updatedInstructions: InstructionState[] = existingInstructions.map((instruction) => {
    if (instruction.id !== id) return instruction;
    return {...instruction, status: "in-progress"};
  });
  store.set(instructions, updatedInstructions);
  return true;
}
