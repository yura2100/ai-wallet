import {Address, formatUnits, Hex} from "viem";
import {buildStepsStateAtom, failStep, inProgress, successStep} from "@/instructions/shared/step-state";
import {InstructionContext} from "@/instructions/shared/instruction-context";
import {getERC20Metadata, waitForTransactionReceipt} from "@/services/web3/shared";
import {simulateTransferERC20, validateTransferERC20, writeTransferERC20} from "@/services/web3/transfer-erc20";
import {truncateAddress} from "@/lib/utils";

export type TransferERC20InstructionType = "transfer-erc20";
export type TransferERC20InstructionParameters = {
  token: Address;
  from: Address;
  to: Address;
  amount: bigint;
};

export async function buildTransferERC20Instruction(params: TransferERC20InstructionParameters, ctx: InstructionContext) {
  const stepsStateAtom = buildStepsStateAtom([
    "transfer-erc20:validate",
    "transfer-erc20:simulate",
    "transfer-erc20:write",
    "transfer-erc20:wait",
  ]);

  const fromWallet = ctx.wallets.find((wallet) => wallet.address === params.from);
  if (!fromWallet) {
    throw new Error("Wallet not found");
  }

  const toWallet = ctx.wallets.find((wallet) => wallet.address === params.to);
  const metadata = await getERC20Metadata(params.token);
  const name = `Transfer ${formatUnits(params.amount, metadata.decimals)} ${metadata.symbol} from @${fromWallet.name} to ${toWallet?.name ? `@${toWallet.name}` : truncateAddress(params.to)}`;
  const description = `Transfer ${formatUnits(params.amount, metadata.decimals)} ${metadata.name} (${metadata.symbol}) from ${fromWallet.address} to ${params.to}`;
  return {
    id: ctx.id,
    type: "transfer-erc20",
    name,
    description,
    atom: stepsStateAtom,
    fields: [
      {
        name: "Token",
        displayValue: `${metadata.name} (${metadata.symbol})`,
        value: params.token,
        copyable: true,
      },
      {
        name: "From",
        displayValue: `@${fromWallet.name}`,
        value: fromWallet.address,
        copyable: true,
      },
      {
        name: "To",
        displayValue: `${toWallet?.name ? `@${toWallet.name}` : truncateAddress(params.to)}`,
        value: params.to,
        copyable: true,
      },
      {
        name: "Amount",
        displayValue: `${formatUnits(params.amount, metadata.decimals)} ${metadata.symbol}`,
        value: params.amount.toString(),
        copyable: false,
      },
    ],
    steps: [
      {
        id: "transfer-erc20:validate",
        name: `Check @${fromWallet.name} balance`,
      },
      {
        id: "transfer-erc20:simulate",
        name: `Simulate transfer ${formatUnits(params.amount, metadata.decimals)} ${metadata.symbol} from @${fromWallet.name} to ${toWallet?.name ? `@${toWallet.name}` : truncateAddress(params.to)}`,
      },
      {
        id: "transfer-erc20:write",
        name: `Transfer ${formatUnits(params.amount, metadata.decimals)} ${metadata.symbol} from @${fromWallet.name} to ${toWallet?.name ? `@${toWallet.name}` : truncateAddress(params.to)}`,
      },
      {
        id: "transfer-erc20:wait",
        name: "Wait for transaction confirmation",
      },
    ],
    execute: async () => {
      ctx.inProgress();

      try {
        inProgress(stepsStateAtom, "transfer-erc20:validate");
        await validateTransferERC20(params);
        successStep(stepsStateAtom, "transfer-erc20:validate");
        // @ts-ignore
      } catch (error: Error) {
        failStep(stepsStateAtom, "transfer-erc20:validate", error.message);
        ctx.fail();
        return;
      }

      try {
        inProgress(stepsStateAtom, "transfer-erc20:simulate");
        await simulateTransferERC20(params);
        successStep(stepsStateAtom, "transfer-erc20:simulate");
        // @ts-ignore
      } catch (error: Error) {
        failStep(stepsStateAtom, "transfer-erc20:simulate", error.message);
        ctx.fail();
        return;
      }

      let hash: Hex;
      try {
        inProgress(stepsStateAtom, "transfer-erc20:write");
        hash = await writeTransferERC20(params, fromWallet);
        successStep(stepsStateAtom, "transfer-erc20:write");
        // @ts-ignore
      } catch (error: Error) {
        failStep(stepsStateAtom, "transfer-erc20:write", error.message);
        ctx.fail();
        return;
      }

      try {
        inProgress(stepsStateAtom, "transfer-erc20:wait");
        await waitForTransactionReceipt(hash);
        successStep(stepsStateAtom, "transfer-erc20:wait");
        // @ts-ignore
      } catch (error: Error) {
        failStep(stepsStateAtom, "transfer-erc20:wait", error.message);
        ctx.fail();
        return;
      }

      ctx.success();
    },
  };
}
