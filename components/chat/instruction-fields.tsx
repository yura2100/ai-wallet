import {Instruction as InstructionType} from "@/instructions/shared/build-workflow";
import {Copy} from "lucide-react";
import {copyToClipboard} from "@/lib/utils";

type InstructionFieldsProps = {
  id: string;
  fields: InstructionType["fields"];
};

export function InstructionFields({ id, fields }: InstructionFieldsProps) {
  return (
    <>
      <div className="flex font-bold mb-2">
        <span className="w-1/2">Parameter</span>
        <span className="w-1/2">Value</span>
      </div>
      <div className="space-y-2">
        {fields.map((field) => (
          <div key={`${field.name}-${id}`} className="flex py-2 border-b last:border-b-0">
            <span className="w-1/2 font-medium">
              {field.name}
            </span>
            {field.copyable ? (
                <span className="text-teal-300 inline-flex items-center">
                  {field.displayValue}
                  <button
                    onClick={() => copyToClipboard(field.value)}
                    className="ml-1 p-1 rounded-full hover:bg-gray-700 transition-colors duration-200"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </span>
              ) : (
                <span className="w-1/2">{field.displayValue} </span>
              )
            }
          </div>
        ))}
      </div>
    </>
  );
}
