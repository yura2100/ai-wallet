import { Button } from "@/components/ui/button";
import { Edit, ChevronDown, Plus, Download, Copy } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { useWallets } from "@/store/wallets";
import { useSelectedWallet } from "@/store/selected-wallet";
import { useBalances } from "@/hooks/use-balances";

interface WalletHeaderProps {
  isLoading: boolean;
  openCreateWallet: () => void;
  openImportWallet: () => void;
  openRenameWallet: () => void;
}

export function WalletHeader({
  isLoading,
  openCreateWallet,
  openRenameWallet,
  openImportWallet,
}: WalletHeaderProps) {
  const { wallets } = useWallets();
  const { totalBalance } = useBalances();
  const [selectedWallet, setSelectedWallet] = useSelectedWallet();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        toast({
          title: "Address copied",
          description: "Wallet address has been copied to clipboard.",
        });
      },
      (err) => {
        console.error("Could not copy text: ", err);
      }
    );
  };

  return (
    <div className="flex flex-col space-y-1.5 pb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <h2 className="text-2xl font-semibold">{selectedWallet.name}</h2>
          <Button
            variant="ghost"
            size="sm"
            className="p-0"
            onClick={openRenameWallet}
          >
            <Edit className="h-4 w-4" />
            <span className="sr-only">Rename Wallet</span>
          </Button>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center space-x-2">
              <span>{selectedWallet.name}</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {wallets.map((wallet) => (
              <DropdownMenuItem
                key={wallet.address}
                onClick={() => setSelectedWallet(wallet)}
              >
                <div className="flex flex-col">
                  <span className="font-medium">{wallet.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {wallet.address}
                  </span>
                </div>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={openCreateWallet}>
              <Plus className="mr-2 h-4 w-4" />
              <span>Create New Wallet</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={openImportWallet}>
              <Download className="mr-2 h-4 w-4" />
              <span>Import from Private Key</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-4">
        <div>
          <div className="text-sm text-muted-foreground flex items-center">
            {selectedWallet.address}
            <Button
              variant="ghost"
              size="sm"
              className="ml-2 p-0"
              onClick={() => copyToClipboard(selectedWallet.address)}
            >
              <Copy className="h-4 w-4" />
              <span className="sr-only">Copy wallet address</span>
            </Button>
          </div>
          <div className="text-3xl font-bold">
            {isLoading ? (
              <Skeleton className="h-9 w-32" />
            ) : (
              `$${totalBalance.toFixed(2)}`
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
