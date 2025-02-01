import { Tabs, TabsContent } from "@/components/ui/tabs"
import Image from "next/image"

interface Token {
  id: number
  name: string
  symbol: string
  amount: number
  value: number
  price: number
  priceChange: number
  valueChange: number
}

interface WalletBalanceProps {
  tokens: Token[]
}

export function WalletBalance({ tokens }: WalletBalanceProps) {
  return (
    <Tabs defaultValue="tokens" className="w-full">
      <TabsContent value="tokens" className="mt-4">
        <div className="bg-background border rounded-lg p-4">
          <ul className="space-y-3">
            {tokens.map((token) => (
              <li
                key={token.id}
                className="flex items-center justify-between p-3 rounded-lg border transition-colors duration-200 ease-in-out hover:bg-muted"
              >
                <div className="flex items-center space-x-3">
                  <Image
                    src={`/placeholder.svg?height=40&width=40&text=${token.symbol}`}
                    alt={token.name}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                  <div>
                    <h3 className="font-medium">{token.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {token.amount} {token.symbol}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold">${token.value.toLocaleString()}</div>
                  <div className={`text-sm ${token.priceChange >= 0 ? "text-green-500" : "text-red-500"}`}>
                    {token.priceChange >= 0 ? "▲" : "▼"} {Math.abs(token.priceChange).toFixed(2)}%
                  </div>
                  <div className={`text-xs ${token.valueChange >= 0 ? "text-green-500" : "text-red-500"}`}>
                    {token.valueChange >= 0 ? "+" : "-"}${Math.abs(token.valueChange).toLocaleString()}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </TabsContent>
    </Tabs>
  )
}

