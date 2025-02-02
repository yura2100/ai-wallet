import {
  buildTransferNativeInstruction,
  TransferNativeInstructionParameters,
  TransferNativeInstructionType
} from "@/instructions/transfer-native";
import {
  buildTransferERC20Instruction,
  TransferERC20InstructionParameters,
  TransferERC20InstructionType
} from "@/instructions/transfer-erc20";
import {store} from "@/store/store-provider";
import {walletsAtom} from "@/store/wallets";
import {InstructionContext} from "@/instructions/shared/instruction-context";
import {PrimitiveAtom} from "jotai";
import {
  buildInstructionsStateAtom,
  failInstruction,
  inProgressInstruction,
  InstructionState,
  successInstruction
} from "@/instructions/shared/instruction-state";
import { match } from "ts-pattern";

function buildContext(): InstructionContext {
  const wallets = store.get(walletsAtom);
  return {
    wallets,
    id: crypto.randomUUID(),
    success: () => undefined,
    fail: () => undefined,
    inProgress: () => undefined,
  };
}

function initContext(ctx: InstructionContext, params: { instructions: PrimitiveAtom<InstructionState[]> }) {
  ctx.success = () => successInstruction(params.instructions, ctx.id);
  ctx.fail = () => failInstruction(params.instructions, ctx.id);
  ctx.inProgress = () => inProgressInstruction(params.instructions, ctx.id);
}

type InstructionParameters =
  | { type: TransferERC20InstructionType; params: TransferERC20InstructionParameters }
  | { type: TransferNativeInstructionType; params: TransferNativeInstructionParameters }

export async function buildWorkflow(params: InstructionParameters[]) {
  const instructionPromises = params.map(async (param) => {
    const ctx = buildContext();
    const instruction = await match(param)
      .with({type: "transfer-erc20"}, ({params}) => buildTransferERC20Instruction(params, ctx))
      .with({type: "transfer-native"}, ({params}) => buildTransferNativeInstruction(params, ctx))
      .exhaustive();
    return { ctx, instruction };
  });
  const instructions = await Promise.all(instructionPromises);
  const instructionsStateParams = instructions.map(({ ctx, instruction }) => ({ id: ctx.id, steps: instruction.atom }));
  const instructionsStateAtom = buildInstructionsStateAtom(instructionsStateParams);

  for (const { ctx } of instructions) {
    initContext(ctx, { instructions: instructionsStateAtom });
  }

  const execute = async () => {
    for (const { instruction } of instructions) {
      await instruction.execute();
    }
  };

  return {
    atom: instructionsStateAtom,
    instructions: instructions.map(({ instruction }) => instruction),
    execute,
  };
}

export type Workflow = Awaited<ReturnType<typeof buildWorkflow>>;
export type Instruction = Workflow["instructions"][number]
