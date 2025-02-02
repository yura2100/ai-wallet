import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion";
import {Card, CardContent} from "@/components/ui/card";
import {InstructionStatus as InstructionStatusType} from "@/instructions/shared/instruction-state";
import {Instruction as InstructionType } from "@/instructions/shared/build-workflow";
import {InstructionStatus} from "@/components/chat/instruction-status";
import {InstructionFields} from "@/components/chat/instruction-fields";
import {useAtom} from "jotai/react";

type InstructionProps = {
  status: InstructionStatusType;
  id: InstructionType["id"];
  name: InstructionType["name"];
  description: InstructionType["description"];
  fields: InstructionType["fields"];
  steps: InstructionType["steps"];
  stepsStateAtom: InstructionType["atom"];
};

export function Instruction({ status, id, name, description, fields, steps, stepsStateAtom }: InstructionProps) {
  const [stepsState] = useAtom(stepsStateAtom);

  return (
    <Accordion
      type="single"
      collapsible
      className="w-full"
    >
      <AccordionItem
        value={`instruction-${id}`}
        className="border rounded-lg"
      >
        <AccordionTrigger className="text-sm px-3 py-2 flex items-center">
          <div className="mr-2">
            <InstructionStatus status={status} />
          </div>
          <span className="flex-grow text-left">
            {name}
          </span>
        </AccordionTrigger>
        <AccordionContent className="border-t">
          <div className="text-sm p-3 space-y-4">
            <Card className="bg-muted">
              <CardContent className="p-3">
                <p className="text-sm text-muted-foreground">
                  {description}
                </p>
              </CardContent>
            </Card>
            <div className="mt-4">
              <InstructionFields id={id} fields={fields} />
            </div>
            <Card className="border rounded-lg">
              <CardContent className="p-3">
                <h4 className="font-medium mb-2">Steps:</h4>
                {steps.map((step) => (
                  <div
                    key={`${step.id}-${id}`}
                    className="flex items-center space-x-2 mb-2 last:mb-0"
                  >
                    <div>
                      <InstructionStatus
                        status={stepsState.find((stepState) => stepState.id === step.id)!.status}
                      />
                    </div>
                    <span>{step.name}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
