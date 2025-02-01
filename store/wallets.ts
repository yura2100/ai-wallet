
import {atomWithStorage, createJSONStorage} from "jotai/utils";
import {useAtom} from "jotai/react";
import {Address, Hex} from "viem";
import {generatePrivateKey, privateKeyToAccount} from "viem/accounts";
import {NonEmptyArray} from "@/lib/types";
import {useEffect} from "react";

export type Wallet = {
  name: string;
  address: Address;
  privateKey: Hex;
};

export const EMPTY_WALLET = {name: "EMPTY", address: "0xEMPTY", privateKey: "0xEMPTY"} as Wallet;

function generateWallet(name: string) {
  const privateKey = generatePrivateKey();
  const { address } = privateKeyToAccount(privateKey);
  return {name, address, privateKey};
}

export const walletsAtom = atomWithStorage<NonEmptyArray<Wallet>>(
  "wallets",
  [EMPTY_WALLET],
  createJSONStorage(() => localStorage),
  { getOnInit: true },
);

export function useWallets() {
  const [wallets, setWallets] = useAtom(walletsAtom);

  useEffect(() => {
    if (wallets[0].address !== EMPTY_WALLET.address) return;
    const wallet = generateWallet("Account 1");
    setWallets([wallet]);
  }, [wallets]);

  const createWallet = (name: string) => {
    const wallet = generateWallet(name);
    setWallets((wallets) => [...wallets, wallet]);
    return wallet;
  };

  const importWallet = (name: string, privateKey: Hex) => {
    const { address } = privateKeyToAccount(privateKey);
    const wallet = {name, address, privateKey};
    setWallets((wallets) => [...wallets, wallet]);
    return wallet;
  };

  const renameWallet = ({ address, privateKey }: Wallet, name: string) => {
    const updatedWallets = wallets.map((wallet) => {
      if (wallet.address !== address) return wallet;
      return {...wallet, name};
    });
    setWallets(updatedWallets as NonEmptyArray<Wallet>);
    return { name, address, privateKey };
  };

  return {wallets, createWallet, importWallet, renameWallet} as const;
}
