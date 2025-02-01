import { useState, useEffect } from "react"
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
import {useSelectedWallet} from "@/store/selected-wallet";
import {useWallets} from "@/store/wallets";

interface RenameWalletDialogProps {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

export function RenameWalletDialog({ isOpen, setIsOpen }: RenameWalletDialogProps) {
  const {renameWallet} = useWallets();
  const [selectedWallet, setSelectedWallet] = useSelectedWallet();
  const [name, setName] = useState(selectedWallet.name);

  useEffect(() => {
    setName(selectedWallet.name)
  }, [selectedWallet.name])

  const handleRenameWallet = () => {
    const wallet = renameWallet(selectedWallet, name);
    setSelectedWallet(wallet);
    setIsOpen(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white">Rename Wallet</DialogTitle>
          <DialogDescription className="text-gray-300 mt-1">Enter a new name for your wallet.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium text-white">
              New Wallet Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter new wallet name"
              className="text-white"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleRenameWallet} className="w-full">
            Rename Wallet
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

