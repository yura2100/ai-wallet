import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Token } from "@/lib/okx-client";
import { Send } from "lucide-react";
import Image from "next/image";

interface SendDialogProps {
  tokens: Token[];
}

export function SendDialog({ tokens }: SendDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="mt-2 sm:mt-0">
          <Send className="h-4 w-4 mr-2" />
          Send
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white">
            Send Crypto
          </DialogTitle>
          <DialogDescription className="text-gray-300 mt-1">
            Enter the details to send cryptocurrency.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="token" className="text-sm font-medium text-white">
              Select Token
            </Label>
            <Select>
              <SelectTrigger id="token" className="w-full text-white">
                <SelectValue placeholder="Choose cryptocurrency" />
              </SelectTrigger>
              <SelectContent>
                {tokens.map((token) => (
                  <SelectItem key={token.tokenAddress} value={token.symbol}>
                    <div className="flex items-center text-white">
                      <Image
                        src={`/placeholder.svg?height=24&width=24&text=${token.symbol}`}
                        alt={token.symbol}
                        width={24}
                        height={24}
                        className="rounded-full mr-2"
                      />
                      <span className="font-medium">{token.symbol}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="amount" className="text-sm font-medium text-white">
              Amount
            </Label>
            <Input
              id="amount"
              type="number"
              placeholder="0.00"
              className="text-white"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address" className="text-sm font-medium text-white">
              Recipient Address
            </Label>
            <Input
              id="address"
              placeholder="Enter wallet address"
              className="text-white"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" className="w-full">
            Send Transaction
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
