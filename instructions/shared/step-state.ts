import {store} from "@/store/store-provider";
import {atom, PrimitiveAtom} from "jotai";

export type StepStatus = "idle" | "in-progress" | "successfull" | "failed" | "aborted";
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
  const updatedSteps: StepState[] = existingSteps.map((step) => {
    if (step.id !== id) return step;
    return {...step, status: "successfull"};
  });
  store.set(steps, updatedSteps);
}

export function failStep(steps: PrimitiveAtom<StepState[]>, id: string, error: string) {
  const existingSteps = store.get(steps);
  const failedStepIndex = existingSteps.findIndex((step) => step.id === id);
  const updatedSteps: StepState[] = existingSteps.map((step, index) => {
    if (index < failedStepIndex) return step;
    if (step.id === id) return {...step, status: "failed", error};
    return {...step, status: "aborted"};
  });
  store.set(steps, updatedSteps);
}

export function inProgress(steps: PrimitiveAtom<StepState[]>, id: string) {
  const updatedSteps: StepState[] = store.get(steps).map((step) => {
    if (step.id !== id) return step;
    return {...step, status: "in-progress"};
  });
  store.set(steps, updatedSteps);
}
