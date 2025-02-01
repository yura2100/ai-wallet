import {atomWithStorage, createJSONStorage} from "jotai/utils";
import {EMPTY_WALLET, useWallets, Wallet} from "./wallets";
import {useEffect} from "react";
import {useAtom} from "jotai/react";

const selectedWalletAtom = atomWithStorage<Wallet>(
  "selected-wallet",
  EMPTY_WALLET,
  createJSONStorage(() => localStorage),
  { getOnInit: true },
);

export function useSelectedWallet() {
  const [selectedWallet, setSelectedWallet] = useAtom(selectedWalletAtom);
  const { wallets } = useWallets();

  useEffect(() => {
    if (selectedWallet.address !== EMPTY_WALLET.address) return;
    setSelectedWallet(wallets[0]);
  }, [wallets]);

  return [selectedWallet, setSelectedWallet] as const;
}
