import { TabsContent } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
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

interface TokenListProps {
  tokens: Token[]
  isLoading: boolean
}

export function TokenList({ tokens, isLoading }: TokenListProps) {
  return (
    <TabsContent value="tokens">
      <ul className="space-y-3">
        {isLoading
          ? Array.from({ length: 3 }).map((_, index) => (
              <li
                key={index}
                className="flex items-center justify-between p-3 rounded-lg border h-[72px] transition-colors duration-200 ease-in-out hover:bg-muted"
              >
                <div className="flex items-center space-x-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div>
                    <Skeleton className="h-5 w-24 mb-1" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                </div>
                <div className="text-right">
                  <Skeleton className="h-5 w-20 mb-1" />
                  <Skeleton className="h-4 w-16 mb-1" />
                  <Skeleton className="h-3 w-12" />
                </div>
              </li>
            ))
          : tokens.map((token) => (
              <li
                key={token.id}
                className="flex items-center justify-between p-3 rounded-lg border h-[72px] transition-colors duration-200 ease-in-out hover:bg-muted"
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
    </TabsContent>
  )
}

