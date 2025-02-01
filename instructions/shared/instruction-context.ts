import { Wallet } from "@/store/wallets";

export type InstructionContext = {
  wallets: Wallet[];
  id: string;
  success: () => void;
  fail: () => void;
  inProgress: () => void;
};
