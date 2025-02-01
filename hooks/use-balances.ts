import { client } from "@/app/api/client";
import { Token } from "@/lib/okx-client";
import { useSelectedWallet } from "@/store/selected-wallet";
import { useQuery } from "@tanstack/react-query";
import { useChain } from "./use-chain";

export function useBalances() {
  const [wallet] = useSelectedWallet();

  const chain = useChain();
  const { data } = useQuery({
    queryKey: ["balances", wallet.address, chain],
    queryFn: async () => {
      const tokensResponse = await client.api.balances.tokens.$get({
        query: { address: wallet.address, chain: chain.toString() },
      });

      const totalResponse = await client.api.balances.total.$get({
        query: { address: wallet.address, chain: chain.toString() },
      });

      let tokens: Token[] = [];
      if (tokensResponse.ok) {
        tokens = (await tokensResponse.json()) ?? [];
      }

      let totalBalance = 0;
      if (totalResponse.ok) {
        totalBalance = (await totalResponse.json()).totalBalanceUsd;
      }

      return { tokens, totalBalance };
    },
  });

  return data ?? { tokens: [], totalBalance: 0 };
}
