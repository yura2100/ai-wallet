import { Wallet } from "@/store/wallets";

export type InstructionContext = {
  wallets: Wallet[];
  id: string;
  success: () => boolean;
  fail: () => boolean;
  inProgress: () => boolean;
};
