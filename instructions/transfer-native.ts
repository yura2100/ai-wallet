import {Address, formatEther, Hex} from "viem";
import {InstructionContext} from "@/instructions/shared/instruction-context";
import {validateTransferNative, writeTranasferNative} from "@/services/web3/transfer-native";
import {buildStepsStateAtom, failStep, inProgress, successStep} from "@/instructions/shared/step-state";
import {waitForTransactionReceipt} from "@/services/web3/shared";

export type TransferNativeInstructionType = "transfer-native";
export type TransferNativeInstructionParameters = {
  from: Address;
  to: Address;
  amount: bigint;
};

export async function buildTransferNativeInstruction(params: TransferNativeInstructionParameters, ctx: InstructionContext) {
  const stepsStateAtom = buildStepsStateAtom([
    "transfer-native:validate",
    "transfer-native:write",
    "transfer-native:wait"
  ]);

  const fromWallet = ctx.wallets.find((wallet) => wallet.address === params.from);
  if (!fromWallet) {
    throw new Error("Wallet not found");
  }

  const toWallet = ctx.wallets.find((wallet) => wallet.address === params.to);
  const name = `Transfer ${formatEther(params.amount)} ETH ${fromWallet.name} to ${toWallet?.name ?? params.to}`;
  const description = `Transfer ${formatEther(params.amount)} Ether (ETH) ${fromWallet.name} to ${toWallet?.name ?? params.to}`;
  return {
    id: ctx.id,
    type: "transfer-native",
    name,
    description,
    atom: stepsStateAtom,
    fields: [
      {
        name: "From",
        displayValue: fromWallet.name,
        value: fromWallet.address,
        copyable: true,
      },
      {
        name: "To",
        displayValue: toWallet?.name ?? params.to,
        value: params.to,
        copyable: true,
      },
      {
        name: "Amount",
        displayValue: formatEther(params.amount),
        value: params.amount,
        copyable: false,
      },
    ],
    steps: [
      {
        id: "transfer-native:validate",
        name: `Check ${fromWallet.name} balance`,
      },
      {
        id: "transfer-native:write",
        name: `Transfer ${formatEther(params.amount)} ${fromWallet.name} to ${toWallet?.name ?? params.to}`,
      },
      {
        id: "transfer-native:wait",
        name: "Wait for transaction confirmation",
      },
    ],
    execute: async () => {
      ctx.inProgress();

      try {
        inProgress(stepsStateAtom, "transfer-native:validate");
        await validateTransferNative(params);
        successStep(stepsStateAtom, "transfer-native:validate");
        // @ts-ignore
      } catch (error: Error) {
        failStep(stepsStateAtom, "transfer-native:validate", error.message);
        ctx.fail();
        return;
      }

      let hash: Hex;
      try {
        inProgress(stepsStateAtom, "transfer-native:write");
        hash = await writeTranasferNative(params, fromWallet);
        successStep(stepsStateAtom, "transfer-native:write");
        // @ts-ignore
      } catch (error: Error) {
        failStep(stepsStateAtom, "transfer-native:write", error.message);
        ctx.fail();
        return;
      }

      try {
        inProgress(stepsStateAtom, "transfer-native:wait");
        await waitForTransactionReceipt(hash);
        successStep(stepsStateAtom, "transfer-native:wait");
        // @ts-ignore
      } catch (error: Error) {
        failStep(stepsStateAtom, "transfer-native:wait", error.message);
        ctx.fail();
        return;
      }

      ctx.success();
    },
  };
}
