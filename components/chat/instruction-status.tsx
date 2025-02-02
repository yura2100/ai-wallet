import {InstructionStatus as InstructionStatusType} from "@/instructions/shared/instruction-state";
import {match} from "ts-pattern";
import {CheckCircle2, CircleAlert, Clock, Loader2, XCircle} from "lucide-react";

type InstructionStatusProps = {
  status: InstructionStatusType;
}

export function InstructionStatus({ status }: InstructionStatusProps) {
  return match(status)
    .with("idle", () => <Clock className="h-4 w-4 text-gray-400" />)
    .with("in-progress", () => <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />)
    .with("successfull", () => <CheckCircle2 className="h-4 w-4 text-green-500" />)
    .with("failed", () => <XCircle className="h-4 w-4 text-red-500" />)
    .with("aborted", () => <CircleAlert className="h-4 w-4 text-yellow-500" />)
    .exhaustive();
}
