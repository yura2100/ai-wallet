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

interface RenameWalletDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onRenameWallet: (newName: string) => void
  currentName: string
}

export function RenameWalletDialog({ isOpen, onOpenChange, onRenameWallet, currentName }: RenameWalletDialogProps) {
  const [renameWalletName, setRenameWalletName] = useState(currentName)

  useEffect(() => {
    setRenameWalletName(currentName)
  }, [currentName])

  const handleRenameWallet = () => {
    onRenameWallet(renameWalletName)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white">Rename Wallet</DialogTitle>
          <DialogDescription className="text-gray-300 mt-1">Enter a new name for your wallet.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="renameName" className="text-sm font-medium text-white">
              New Wallet Name
            </Label>
            <Input
              id="renameName"
              value={renameWalletName}
              onChange={(e) => setRenameWalletName(e.target.value)}
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

