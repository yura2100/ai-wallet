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

interface ImportWalletDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onImportWallet: (privateKey: string) => void
}

export function ImportWalletDialog({ isOpen, onOpenChange, onImportWallet }: ImportWalletDialogProps) {
  const [privateKey, setPrivateKey] = useState("")

  const handleImportWallet = () => {
    onImportWallet(privateKey)
    setPrivateKey("")
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white">Import Wallet</DialogTitle>
          <DialogDescription className="text-gray-300 mt-1">
            Enter your private key to import a wallet.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
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

