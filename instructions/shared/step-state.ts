import {store} from "@/store/store-provider";
import {atom, PrimitiveAtom} from "jotai";

export type StepStatus = "idle" | "in-progress" | "successfull" | "failed" | "aborted" | "declined";
export type StepState = {
  id: string;
  status: StepStatus;
  error?: string;
};

export function buildStepsStateAtom(ids: string[]) {
  const steps: StepState[] = ids.map((id) => ({id, status: "idle"}));
  return atom(steps);
}

export function successStep(steps: PrimitiveAtom<StepState[]>, id: string) {
  const existingSteps = store.get(steps);
  const currentStep = existingSteps.find((step) => step.id === id);
  if (!currentStep || currentStep.status !== "in-progress") return false;

  const updatedSteps: StepState[] = existingSteps.map((step) => {
    if (step.id !== id) return step;
    return {...step, status: "successfull"};
  });
  store.set(steps, updatedSteps);
  return true;
}

export function failStep(steps: PrimitiveAtom<StepState[]>, id: string, error: string) {
  const existingSteps = store.get(steps);
  const currentStep = existingSteps.find((step) => step.id === id);
  if (!currentStep || currentStep.status !== "in-progress") return false;

  const failedStepIndex = existingSteps.findIndex((step) => step.id === id);
  const updatedSteps: StepState[] = existingSteps.map((step, index) => {
    if (index < failedStepIndex) return step;
    if (step.id === id) return {...step, status: "failed", error};
    return {...step, status: "aborted"};
  });
  store.set(steps, updatedSteps);
  return true;
}

export function inProgressStep(steps: PrimitiveAtom<StepState[]>, id: string) {
  const existingSteps = store.get(steps);
  const currentStep = existingSteps.find((step) => step.id === id);
  if (!currentStep || currentStep.status !== "idle") return false

  const updatedSteps: StepState[] = existingSteps.map((step) => {
    if (step.id !== id) return step;
    return {...step, status: "in-progress"};
  });
  store.set(steps, updatedSteps);
  return true;
}

export function declineSteps(steps: PrimitiveAtom<StepState[]>) {
  const existingSteps = store.get(steps);
  const updatedSteps: StepState[] = existingSteps.map((step) => {
    return {...step, status: "declined"};
  });
  store.set(steps, updatedSteps);
}
