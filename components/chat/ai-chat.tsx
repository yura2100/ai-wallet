"use client";
import { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Copy } from "lucide-react";
import { WalletBalance } from "../wallet-balance";
import { Token } from "@/lib/okx-client";
import {Workflow} from "@/components/chat/workflow";
import {copyToClipboard, truncateAddress} from "@/lib/utils";
import {Address, parseEther, parseUnits} from "viem";
import {useQuery} from "@tanstack/react-query";
import {buildWorkflow} from "@/instructions/shared/build-workflow";

interface Wallet {
  id: string;
  name: string;
}

type AssistantMessage = {
  id: number;
  role: "assistant";
  content: string;
  tokens?: Token[];
  mockInstructions?: true;
};

type UserMessage = {
  id: number;
  role: "user";
  content: string;
};

type Message = AssistantMessage | UserMessage;

const initialMessages: Message[] = [
  {
    id: 1,
    role: "assistant",
    content:
      "Hello! How can I assist you with your crypto-related questions today?",
  },
  {
    id: 2,
    role: "user",
    content: "What's the current balance of @Main Wallet?",
  },
  {
    id: 3,
    role: "assistant",
    content: "I'll check the current balance of your @Main Wallet.",
    tokens: [
      {
        symbol: "BTC",
        balance: "0.5",
        usdBalance: 30000,
        tokenAddress: "0x1234567890abcdef1234567890abcdef12345678",
        chainIndex: 1,
        tokenPrice: 60000,
        tokenType: "1",
      },
      {
        symbol: "ETH",
        balance: "2",
        usdBalance: 4000,
        tokenAddress: "0xabcdef1234567890abcdef1234567890abcdef12",
        chainIndex: 1,
        tokenPrice: 2000,
        tokenType: "1",
      },
      {
        symbol: "ADA",
        balance: "1000",
        usdBalance: 500,
        tokenAddress: "0x1234567890abcdef1234567890abcdef12345678",
        chainIndex: 1,
        tokenPrice: 0.5,
        tokenType: "1",
      },
    ],
  },
  {
    id: 4,
    role: "user",
    content: "Send 0.1 BTC from @Main Wallet to @Savings",
  },
  {
    id: 5,
    role: "assistant",
    content:
      "I understand you want to send 0.1 BTC from your Main Wallet to your Savings wallet. I'll prepare that transaction for you. Here are the steps I'm taking:",
    mockInstructions: true,
  },
];

const wallets: Wallet[] = [
  { id: "1", name: "Main Wallet" },
  { id: "2", name: "Savings" },
  { id: "3", name: "Trading" },
];

export function AIChat() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState<Wallet[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Mock instructions
  const { data } = useQuery({
    queryKey: ["instructions"],
    queryFn: async () => {
      const { instructions, atom, execute } = await buildWorkflow([
        {
          type: "transfer-native",
          params: {
            from: "0x7Fba0cdb90f2eD6968bB7b59CB0237768028aA25",
            to: "0x27Afb19371843C9A0Da0D77cD7FFa7E8eC73ef16",
            amount: parseEther("2.1"),
          },
        },
        {
          type: "transfer-erc20",
          params: {
            token: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", // USDC
            from: "0x747293aDBbD7248067e394cDF15efb6aDB084481",
            to: "0x7Fba0cdb90f2eD6968bB7b59CB0237768028aA25",
            amount: parseUnits("300", 6),
          },
        },
        {
          type: "transfer-erc20",
          params: {
            token: "0x3992B27dA26848C2b19CeA6Fd25ad5568B68AB98", // OM
            from: "0x747293aDBbD7248067e394cDF15efb6aDB084481",
            to: "0x27Afb19371843C9A0Da0D77cD7FFa7E8eC73ef16",
            amount: parseEther("100.59"),
          },
        },
      ]);
      return { instructions, instructionsStateAtom: atom, execute };
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newInput = e.target.value;
    setInput(newInput);

    const lastAtSymbol = newInput.lastIndexOf("@");
    if (lastAtSymbol !== -1) {
      const query = newInput.slice(lastAtSymbol + 1).toLowerCase();
      setSuggestions(
        wallets.filter((wallet) => wallet.name.toLowerCase().includes(query))
      );
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (walletName: string) => {
    const lastAtSymbol = input.lastIndexOf("@");
    if (lastAtSymbol !== -1) {
      const newInput = input.slice(0, lastAtSymbol) + "@" + walletName + " ";
      setInput(newInput);
      setSuggestions([]);
      inputRef.current?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      const newUserMessage: UserMessage = {
        id: messages.length + 1,
        role: "user",
        content: input.trim(),
      };
      let newAssistantMessage: AssistantMessage;

      if (input.toLowerCase().includes("balance")) {
        newAssistantMessage = {
          id: messages.length + 2,
          role: "assistant",
          content:
            "I'll check the balance for you. Here are the steps I'm taking:",
          tokens: [
            {
              symbol: "BTC",
              balance: "0.5",
              usdBalance: 30000,
              tokenAddress: "0x1234567890abcdef1234567890abcdef12345678",
              chainIndex: 1,
              tokenPrice: 60000,
              tokenType: "1",
            },
            {
              symbol: "ETH",
              balance: "2",
              usdBalance: 4000,
              tokenAddress: "0xabcdef1234567890abcdef1234567890abcdef12",
              chainIndex: 1,
              tokenPrice: 2000,
              tokenType: "1",
            },
          ],
        };
      } else if (
        input.toLowerCase().includes("send") ||
        input.toLowerCase().includes("transfer")
      ) {
        newAssistantMessage = {
          id: messages.length + 2,
          role: "assistant",
          content:
            "I understand you want to make a transfer. I'll prepare that transaction for you. Here are the steps I'm taking:",
        };
      } else {
        newAssistantMessage = {
          id: messages.length + 2,
          role: "assistant",
          content: `I'm sorry, I couldn't determine a specific action from your request. Could you please clarify if you want to check a balance, make a transfer, or perform another action?`,
        };
      }

      setMessages([...messages, newUserMessage, newAssistantMessage]);
      setInput("");
      setSuggestions([]);
    }
  };

  const renderMessageContent = (message: Message) => {
    if (message.role === "assistant") {
      return (
        <>
          <div>
            {message.content.split(/(@\w+\s*\w*)/).map((part, index) => {
              if (part.startsWith("@")) {
                const walletName = part.slice(1).trim();
                if (wallets.some((wallet) => wallet.name === walletName)) {
                  return (
                    <span key={index} className="text-teal-300">
                      {part}
                    </span>
                  );
                }
              }
              return part;
            })}
          </div>
          {message.mockInstructions && data && (
            <Workflow
              instructions={data.instructions}
              instructionsStateAtom={data.instructionsStateAtom}
              execute={data.execute}
            />
          )}
          {message.tokens && <WalletBalance tokens={message.tokens} />}
        </>
      );
    }

    return message.content
      .split(/(@\w+\s*\w*|0x[a-fA-F0-9]{40})/)
      .map((part, index) => {
        if (part.startsWith("@")) {
          const walletName = part.slice(1).trim();
          if (wallets.some((wallet) => wallet.name === walletName)) {
            return (
              <span key={index} className="text-teal-300">
                {part}
              </span>
            );
          }
        } else if (part.startsWith("0x") && part.length === 42) {
          const truncatedAddress = truncateAddress(part as Address);
          return (
            <span
              key={index}
              className="text-teal-300 inline-flex items-center"
            >
              {truncatedAddress}
              <button
                onClick={() => copyToClipboard(part)}
                className="ml-1 p-1 rounded-full hover:bg-gray-700 transition-colors duration-200"
              >
                <Copy className="h-4 w-4" />
              </button>
            </span>
          );
        }
        return part;
      });
  };

  return (
    <Card className="w-full h-[80vh] flex flex-col">
      <CardContent className="flex-grow overflow-hidden flex flex-col p-4">
        <ScrollArea className="flex-grow pr-4 mb-4">
          <div className="space-y-4">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${
                  m.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div className="rounded-lg p-3 max-w-[80%] bg-muted">
                  {renderMessageContent(m)}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
      <div className="p-4 border-t">
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <div className="relative flex-grow">
            <Input
              ref={inputRef}
              value={input}
              onChange={handleInputChange}
              placeholder="Ask about cryptocurrency..."
              className="flex-grow"
            />
            {suggestions.length > 0 && (
              <div className="absolute bottom-full left-0 bg-background border rounded-md shadow-lg max-h-32 overflow-y-auto w-64">
                {suggestions.map((wallet) => (
                  <div
                    key={wallet.id}
                    className="px-3 py-2 hover:bg-muted cursor-pointer"
                    onClick={() => handleSuggestionClick(wallet.name)}
                  >
                    @{wallet.name}
                  </div>
                ))}
              </div>
            )}
          </div>
          <Button type="submit">Send</Button>
        </form>
      </div>
    </Card>
  );
}
