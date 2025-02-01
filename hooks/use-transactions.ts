import { client } from "@/app/api/client";
import { useSelectedWallet } from "@/store/selected-wallet";
import { useQuery } from "@tanstack/react-query";
import { useChain } from "./use-chain";

export function useTransactions() {
  const [wallet] = useSelectedWallet();

  const chain = useChain();
  const { data } = useQuery({
    queryKey: ["transactions", wallet.address, chain],
    queryFn: async () => {
      const response = await client.api.transactions.$get({
        query: { address: wallet.address, chain: chain.toString() },
      });

      if (response.ok) {
        const transactions = await response.json();

        return transactions?.map((transaction) => ({
          ...transaction,
          txTime: new Date(transaction.txTime),
        }));
      }
    },
  });

  return data ?? [];
}
