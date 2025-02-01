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

interface CreateWalletDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onCreateWallet: (name: string) => void
}

export function CreateWalletDialog({ isOpen, onOpenChange, onCreateWallet }: CreateWalletDialogProps) {
  const [newWalletName, setNewWalletName] = useState("")

  const handleCreateWallet = () => {
    onCreateWallet(newWalletName)
    setNewWalletName("")
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
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

