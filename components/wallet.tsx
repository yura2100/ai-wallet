"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WalletHeader } from "./wallet-header";
import { TokenList } from "./token-list";
import { ActivityList } from "./activity-list";
import { SendDialog } from "./send-dialog";
import { CreateWalletDialog } from "./create-wallet-dialog";
import { ImportWalletDialog } from "./import-wallet-dialog";
import { RenameWalletDialog } from "./rename-wallet-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useBalances } from "@/hooks/use-balances";
import { useTransactions } from "@/hooks/use-transactions";

export function Wallet() {
  const [isLoading, setIsLoading] = useState(true);
  const { tokens } = useBalances();
  const transactions = useTransactions();

  const [isCreateWalletOpen, setIsCreateWalletOpen] = useState(false);
  const [isImportWalletOpen, setIsImportWalletOpen] = useState(false);
  const [isRenameWalletOpen, setIsRenameWalletOpen] = useState(false);

  const getBlockExplorerUrl = (symbol: string, txHash: string) => {
    return `https://etherscan.io/tx/${txHash}`;
  };

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // 2 seconds delay

    return () => clearTimeout(timer);
  }, []);

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
            <ActivityList
              transactions={transactions}
              getBlockExplorerUrl={getBlockExplorerUrl}
              isLoading={isLoading}
            />
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
  );
}
