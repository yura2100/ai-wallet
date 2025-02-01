import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {useWallets} from "@/store/wallets";
import {useSelectedWallet} from "@/store/selected-wallet";

interface CreateWalletDialogProps {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

export function CreateWalletDialog({ isOpen, setIsOpen }: CreateWalletDialogProps) {
  const [newWalletName, setNewWalletName] = useState("")
  const { createWallet } = useWallets();
  const [, setSelectedWallet] = useSelectedWallet();

  const handleCreateWallet = () => {
    const wallet = createWallet(newWalletName);
    setSelectedWallet(wallet);
    setNewWalletName("");
    setIsOpen(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white">Create New Wallet</DialogTitle>
          <DialogDescription className="text-gray-300 mt-1">Enter a name for your new wallet.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="walletName" className="text-sm font-medium text-white">
              Wallet Name
            </Label>
            <Input
              id="walletName"
              value={newWalletName}
              onChange={(e) => setNewWalletName(e.target.value)}
              placeholder="Enter wallet name"
              className="text-white"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleCreateWallet} className="w-full">
            Create Wallet
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

