import {Address, erc20Abi} from "viem";
import {getPublicClient, getWalletClient} from "@/services/web3/shared";
import {Wallet} from "@/store/wallets";

type TransferNativeParameters = {
  token: Address;
  from: Address;
  to: Address;
  amount: bigint;
};

export async function validateTransferERC20({ token, from, to, amount } : TransferNativeParameters) {
  const publicClient = getPublicClient();
  const balance = await publicClient.readContract({
    address: token,
    abi: [erc20Abi],
    functionName: "balanceOf",
    args: [from],
  });

  if (balance < amount) {
    throw new Error("Insufficient balance");
  }
}

export async function simulateTransferERC20({ token, from, to, amount } : TransferNativeParameters) {
  const publicClient = getPublicClient();
  await publicClient.simulateContract({
    address: token,
    abi: [erc20Abi],
    functionName: "transfer",
    args: [to, amount],
    account: from,
  })
}

export function writeTransferERC20({ token, from, to, amount } : TransferNativeParameters, wallet: Wallet) {
  if (from !== wallet.address) {
    throw new Error("Cannot transfer from a different address");
  }

  const walletClient = getWalletClient(wallet);
  return walletClient.writeContract({
    address: token,
    abi: [erc20Abi],
    functionName: "transfer",
    args: [to, amount],
  });
}
