import {Address, createPublicClient, createWalletClient, erc20Abi, Hex, http} from "viem";
import {base} from "viem/chains";
import {Wallet} from "@/store/wallets";
import {privateKeyToAccount} from "viem/accounts";
import {ERC20_ABI} from "@/services/web3/abi/erc20-abi";

export function getPublicClient() {
  return createPublicClient({
    chain: base,
    transport: http(),
  });
}

export function getWalletClient(wallet: Wallet) {
  const account = privateKeyToAccount(wallet.privateKey);
  return createWalletClient({
    account,
    chain: base,
    transport: http("https://base.llamarpc.com"),
  });
}

export async function waitForTransactionReceipt(hash: Hex) {
  const publicClient = getPublicClient();
  return publicClient.waitForTransactionReceipt({ hash });
}

export async function getERC20Metadata(token: Address) {
  const publicClient = getPublicClient();
  const config = {
    address: token,
    abi: ERC20_ABI,
  } as const;
  const [name, symbol, decimals] = await publicClient.multicall({
    contracts: [
      { ...config, functionName: "name" },
      { ...config, functionName: "symbol" },
      { ...config, functionName: "decimals" },
    ],
    allowFailure: false,
  });
  return { name, symbol, decimals };
}
