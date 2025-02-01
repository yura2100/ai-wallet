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
import {Hex} from "viem";

interface ImportWalletDialogProps {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

export function ImportWalletDialog({ isOpen, setIsOpen }: ImportWalletDialogProps) {
  const [name, setName] = useState("")
  const [privateKey, setPrivateKey] = useState("")
  const { importWallet } = useWallets();
  const [, setSelectedWallet] = useSelectedWallet();

  const handleImportWallet = () => {
    const wallet = importWallet(name, privateKey as Hex);
    setSelectedWallet(wallet);
    setName("");
    setPrivateKey("")
    setIsOpen(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white">Import Wallet</DialogTitle>
          <DialogDescription className="text-gray-300 mt-1">
            Enter your private key to import a wallet.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium text-white">
              Wallet Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter wallet name"
              className="text-white"
              type="text"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="privateKey" className="text-sm font-medium text-white">
              Private Key
            </Label>
            <Input
              id="privateKey"
              value={privateKey}
              onChange={(e) => setPrivateKey(e.target.value)}
              placeholder="Enter private key"
              className="text-white"
              type="password"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleImportWallet} className="w-full">
            Import Wallet
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

