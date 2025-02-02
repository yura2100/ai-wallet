import {Card} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Instruction} from "@/components/chat/instruction";
import {Instruction as InstructionType} from "@/instructions/shared/build-workflow";
import {PrimitiveAtom} from "jotai";
import {InstructionState} from "@/instructions/shared/instruction-state";
import {useAtom} from "jotai/react";
import {useRunWorkflowMutation} from "@/hooks/use-run-workflow-mutation";
import {useDeclineWorkflowMutation} from "@/hooks/use-decline-workflow-mutation";

type WorkflowProps = {
  instructions: InstructionType[];
  instructionsStateAtom: PrimitiveAtom<InstructionState[]>;
  execute: () => Promise<void>;
};

export function Workflow({ instructions, instructionsStateAtom, execute }: WorkflowProps) {
  const [instructionsState] = useAtom(instructionsStateAtom);
  const { mutate: run, isIdle: isNotRunning } = useRunWorkflowMutation();
  const { mutate: decline, isIdle: isNotDeclined } = useDeclineWorkflowMutation();

  return (
    <div className="mt-4">
      <Card className="bg-background border rounded-lg p-4">
        <div className="space-y-2">
          {instructions.map((instruction) => (
            <Instruction
              status={instructionsState.find((state) => state.id === instruction.id)!.status}
              key={instruction.id}
              id={instruction.id}
              name={instruction.name}
              description={instruction.description}
              fields={instruction.fields}
              steps={instruction.steps}
              stepsStateAtom={instruction.atom}
            />
          ))}
        </div>
        {isNotRunning && isNotDeclined && (
          <div className="mt-4 flex justify-end space-x-2">
            <Button
              onClick={() => decline(instructionsStateAtom)}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Decline
            </Button>
            <Button
              onClick={() => run(execute)}
              className="bg-green-500 hover:bg-green-600 text-white"
            >
              Approve
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
