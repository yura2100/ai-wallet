"use client";

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { WalletHeader } from "./wallet-header"
import { TokenList } from "./token-list"
import { ActivityList } from "./activity-list"
import { SendDialog } from "./send-dialog"
import { CreateWalletDialog } from "./create-wallet-dialog"
import { ImportWalletDialog } from "./import-wallet-dialog"
import { RenameWalletDialog } from "./rename-wallet-dialog"
import { ScrollArea } from "@/components/ui/scroll-area"

export function Wallet() {
  const [isLoading, setIsLoading] = useState(true)
  const [tokens, setTokens] = useState([
    {
      id: 1,
      name: "Bitcoin",
      symbol: "BTC",
      amount: 0.5,
      value: 15000,
      price: 30000,
      priceChange: 5.2,
      valueChange: 780,
    },
    {
      id: 2,
      name: "Ethereum",
      symbol: "ETH",
      amount: 2,
      value: 4000,
      price: 2000,
      priceChange: -2.1,
      valueChange: -84,
    },
    { id: 3, name: "Cardano", symbol: "ADA", amount: 1000, value: 500, price: 0.5, priceChange: 1.5, valueChange: 7.5 },
  ])
  const [transactions, setTransactions] = useState([
    { id: 1, type: "Received", amount: 0.1, symbol: "BTC", date: "2023-05-01", txHash: "0xabcd...1234" },
    { id: 2, type: "Sent", amount: 50, symbol: "ADA", date: "2023-05-03", txHash: "0xefgh...5678" },
    { id: 3, type: "Received", amount: 0.5, symbol: "ETH", date: "2023-05-05", txHash: "0xijkl...9012" },
  ])

  const [isCreateWalletOpen, setIsCreateWalletOpen] = useState(false)
  const [isImportWalletOpen, setIsImportWalletOpen] = useState(false)
  const [isRenameWalletOpen, setIsRenameWalletOpen] = useState(false)

  const getBlockExplorerUrl = (symbol: string, txHash: string) => {
    switch (symbol) {
      case "BTC":
        return `https://www.blockchain.com/btc/tx/${txHash}`
      case "ETH":
        return `https://etherscan.io/tx/${txHash}`
      case "ADA":
        return `https://cardanoscan.io/transaction/${txHash}`
      default:
        return "#"
    }
  }

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000) // 2 seconds delay

    return () => clearTimeout(timer)
  }, [])

  return (
    <Card className="w-full h-[80vh] flex flex-col">
      <CardHeader>
        <WalletHeader
          isLoading={isLoading}
          openCreateWallet={() => setIsCreateWalletOpen(true)}
          openImportWallet={() => setIsImportWalletOpen(true)}
          openRenameWallet={() => setIsRenameWalletOpen(true)}
        />
        <SendDialog tokens={tokens} />
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden">
        <ScrollArea className="h-full">
          <Tabs defaultValue="tokens" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="tokens">Tokens</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>
            <TokenList tokens={tokens} isLoading={isLoading} />
            <ActivityList transactions={transactions} getBlockExplorerUrl={getBlockExplorerUrl} isLoading={isLoading} />
          </Tabs>
        </ScrollArea>
      </CardContent>
      <CreateWalletDialog
        isOpen={isCreateWalletOpen}
        setIsOpen={setIsCreateWalletOpen}
      />
      <ImportWalletDialog
        isOpen={isImportWalletOpen}
        setIsOpen={setIsImportWalletOpen}
      />
      <RenameWalletDialog
        isOpen={isRenameWalletOpen}
        setIsOpen={setIsRenameWalletOpen}
      />
    </Card>
  )
}
