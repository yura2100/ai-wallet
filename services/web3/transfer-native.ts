import {Address} from "viem";
import {getPublicClient, getWalletClient} from "@/services/web3/shared";
import {Wallet} from "@/store/wallets";

type TransferNativeParameters = {
  from: Address;
  to: Address;
  amount: bigint;
};

export async function validateTransferNative({ from, amount } : TransferNativeParameters) {
  const publicClient = getPublicClient();
  const balance = await publicClient.getBalance({ address: from });
  if (balance < amount) {
    throw new Error("Insufficient balance");
  }
}

export function writeTranasferNative({ from, to, amount } : TransferNativeParameters, wallet: Wallet) {
  if (from !== wallet.address) {
    throw new Error("Cannot transfer from a different address");
  }

  const walletClient = getWalletClient(wallet);
  return walletClient.sendTransaction({
    to,
    value: amount,
  });
}
