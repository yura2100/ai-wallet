import { TabsContent } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { ExternalLink } from "lucide-react";
import { Transaction } from "@/lib/okx-client";

interface ActivityListProps {
  transactions: Transaction[];
  getBlockExplorerUrl: (symbol: string, txHash: string) => string;
  isLoading: boolean;
}

export function ActivityList({
  transactions,
  getBlockExplorerUrl,
  isLoading,
}: ActivityListProps) {
  return (
    <TabsContent value="activity">
      <ul className="space-y-3">
        {isLoading
          ? Array.from({ length: 3 }).map((_, index) => (
              <li
                key={index}
                className="grid grid-cols-[1fr,0.5fr,2fr,2fr,auto] gap-2 items-center p-3 rounded-lg border h-[52px] transition-colors duration-200 ease-in-out hover:bg-muted"
              >
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-5 w-8" />
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-5 w-5" />
              </li>
            ))
          : transactions.map((tx, index) => (
              <li
                key={index}
                className="grid grid-cols-[1fr,0.5fr,2fr,2fr,auto] gap-2 items-center p-3 rounded-lg border h-[52px] transition-colors duration-200 ease-in-out hover:bg-muted"
              >
                <span
                  className={`font-medium ${
                    tx.type === "Received" ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {tx.type}
                </span>
                <span></span>
                <span className="font-bold">
                  {tx.amount} {tx.symbol}
                </span>
                <span className="text-sm text-muted-foreground">
                  {tx.txTime.toUTCString()}
                </span>
                <a
                  href={getBlockExplorerUrl(tx.symbol, tx.txHash)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-400"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              </li>
            ))}
      </ul>
    </TabsContent>
  );
}
