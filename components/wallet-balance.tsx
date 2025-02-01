import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Token } from "@/lib/okx-client";
import Image from "next/image";

interface WalletBalanceProps {
  tokens: Token[];
}

export function WalletBalance({ tokens }: WalletBalanceProps) {
  return (
    <Tabs defaultValue="tokens" className="w-full">
      <TabsContent value="tokens" className="mt-4">
        <div className="bg-background border rounded-lg p-4">
          <ul className="space-y-3">
            {tokens.map((token) => (
              <li
                key={token.tokenAddress}
                className="flex items-center justify-between p-3 rounded-lg border transition-colors duration-200 ease-in-out hover:bg-muted"
              >
                <div className="flex items-center space-x-3">
                  <Image
                    src={`/placeholder.svg?height=40&width=40&text=${token.symbol}`}
                    alt={token.symbol}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                  <div>
                    <h3 className="font-medium">{token.symbol}</h3>
                    <p className="text-sm text-muted-foreground">
                      {token.balance} {token.symbol}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold">
                    ${token.usdBalance.toLocaleString()}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </TabsContent>
    </Tabs>
  );
}
