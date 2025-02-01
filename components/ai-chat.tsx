"use client";
import { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Copy, Clock, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { WalletBalance } from "./wallet-balance";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Token } from "@/lib/okx-client";

interface Wallet {
  id: string;
  name: string;
}

type InstructionStatus = "idle" | "in_progress" | "done" | "failed";

type Instruction = {
  action: string;
  description: string;
  params: Record<string, string | number>;
  status: InstructionStatus;
  steps: { action: string; status: InstructionStatus }[];
};

type AssistantMessage = {
  id: number;
  role: "assistant";
  content: string;
  tokens?: Token[];
  instructions?: Instruction[];
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
    instructions: [
      {
        action: "VALIDATE_BALANCE",
        params: { walletId: "@Main Wallet", amount: 0.1, currency: "BTC" },
        status: "done",
        steps: [
          { action: "Check wallet exists", status: "done" },
          { action: "Verify sufficient balance", status: "done" },
        ],
        description:
          "This step ensures that the source wallet has sufficient funds for the transfer.",
      },
      {
        action: "PREPARE_TRANSACTION",
        params: {
          fromWalletId: "@Main Wallet",
          toWalletId: "@Savings",
          amount: 0.1,
          currency: "BTC",
        },
        status: "in_progress",
        steps: [
          { action: "Calculate transaction fee", status: "done" },
          { action: "Prepare transaction data", status: "in_progress" },
        ],
        description:
          "This step creates the transaction data, including calculating fees and preparing the transfer details.",
      },
      {
        action: "CONFIRM_TRANSACTION",
        params: { transactionId: "0x1234567890abcdef1234567890abcdef12345678" },
        status: "idle",
        steps: [],
        description:
          "This step waits for user confirmation before proceeding with the transaction.",
      },
      {
        action: "EXECUTE_TRANSACTION",
        params: { transactionId: "0x1234567890abcdef1234567890abcdef12345678" },
        status: "idle",
        steps: [],
        description:
          "Once confirmed, this step sends the transaction to the blockchain network for processing.",
      },
      {
        action: "DISPLAY_TRANSACTION_RESULT",
        params: { transactionId: "0x1234567890abcdef1234567890abcdef12345678" },
        status: "idle",
        steps: [],
        description:
          "This final step shows the result of the transaction, including confirmation and any relevant details.",
      },
    ],
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
  const [isApproved, setIsApproved] = useState(false);
  const [isDeclined, setIsDeclined] = useState(false);

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
      setIsApproved(false);
      setIsDeclined(false);
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
          instructions: [
            {
              action: "FETCH_WALLET_BALANCE",
              description:
                "This step retrieves the current balance of the specified wallet from the blockchain.",
              params: { walletId: "@Main Wallet" },
              status: "in_progress",
              steps: [],
            },
            {
              action: "DISPLAY_BALANCE",
              description:
                "Once the balance is fetched, this step formats and displays the balance information.",
              params: { walletId: "@Main Wallet" },
              status: "idle",
              steps: [],
            },
          ],
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
          instructions: [
            {
              action: "VALIDATE_BALANCE",
              description:
                "This step ensures that the source wallet has sufficient funds for the transfer.",
              params: {
                walletId: "@Main Wallet",
                amount: 0.1,
                currency: "BTC",
              },
              status: "done",
              steps: [
                { action: "Check wallet exists", status: "done" },
                { action: "Verify sufficient balance", status: "done" },
              ],
            },
            {
              action: "PREPARE_TRANSACTION",
              description:
                "This step creates the transaction data, including calculating fees and preparing the transfer details.",
              params: {
                fromWalletId: "@Main Wallet",
                toWalletId: "@Savings",
                amount: 0.1,
                currency: "BTC",
              },
              status: "in_progress",
              steps: [
                { action: "Calculate transaction fee", status: "done" },
                { action: "Prepare transaction data", status: "in_progress" },
              ],
            },
            {
              action: "CONFIRM_TRANSACTION",
              description:
                "This step waits for user confirmation before proceeding with the transaction.",
              params: {
                transactionId: "0xabcdef1234567890abcdef1234567890abcdef12",
              },
              status: "idle",
              steps: [],
            },
            {
              action: "EXECUTE_TRANSACTION",
              description:
                "Once confirmed, this step sends the transaction to the blockchain network for processing.",
              params: {
                transactionId: "0xabcdef1234567890abcdef1234567890abcdef12",
              },
              status: "idle",
              steps: [],
            },
            {
              action: "DISPLAY_TRANSACTION_RESULT",
              description:
                "This final step shows the result of the transaction, including confirmation and any relevant details.",
              params: {
                transactionId: "0xabcdef1234567890abcdef1234567890abcdef12",
              },
              status: "idle",
              steps: [],
            },
          ],
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

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Address copied",
        description: "The full address has been copied to your clipboard.",
      });
    });
  };

  const getStatusIcon = (status: InstructionStatus) => {
    switch (status) {
      case "idle":
        return <Clock className="h-4 w-4 text-gray-400" />;
      case "in_progress":
        return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />;
      case "done":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const renderValue = (value: string | number) => {
    if (typeof value === "string") {
      if (value.startsWith("@")) {
        return <span className="text-teal-300">{value}</span>;
      } else if (value.startsWith("0x")) {
        const truncatedAddress = truncateAddress(value);
        return (
          <span className="text-teal-300 inline-flex items-center">
            {truncatedAddress}
            <button
              onClick={() => copyToClipboard(value)}
              className="ml-1 p-1 rounded-full hover:bg-gray-700 transition-colors duration-200"
            >
              <Copy className="h-4 w-4" />
            </button>
          </span>
        );
      }
    }
    return String(value);
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
          {message.instructions && (
            <div className="mt-4">
              <Card className="bg-background border rounded-lg p-4">
                <div className="space-y-2">
                  {message.instructions.map((instruction, index) => (
                    <Accordion
                      key={index}
                      type="single"
                      collapsible
                      className="w-full"
                    >
                      <AccordionItem
                        value={`instruction-${index}`}
                        className="border rounded-lg"
                      >
                        <AccordionTrigger className="text-sm px-3 py-2 flex items-center">
                          <div className="mr-2">
                            {getStatusIcon(
                              isApproved
                                ? instruction.status
                                : isDeclined
                                ? "failed"
                                : "idle"
                            )}
                          </div>
                          <span className="flex-grow text-left">
                            {instruction.action}
                          </span>
                        </AccordionTrigger>
                        <AccordionContent className="border-t">
                          <div className="text-sm p-3 space-y-4">
                            <Card className="bg-muted">
                              <CardContent className="p-3">
                                <p className="text-sm text-muted-foreground">
                                  {instruction.description}
                                </p>
                              </CardContent>
                            </Card>
                            <div className="mt-4">
                              <div className="flex font-bold mb-2">
                                <span className="w-1/2">Parameter</span>
                                <span className="w-1/2">Value</span>
                              </div>
                              <div className="space-y-2">
                                {Object.entries(instruction.params).map(
                                  ([key, value], index) => (
                                    <div
                                      key={key}
                                      className="flex py-2 border-b last:border-b-0"
                                    >
                                      <span className="w-1/2 font-medium">
                                        {key}
                                      </span>
                                      <span className="w-1/2">
                                        {renderValue(value)}
                                      </span>
                                    </div>
                                  )
                                )}
                              </div>
                            </div>
                            <Card className="border rounded-lg">
                              <CardContent className="p-3">
                                <h4 className="font-medium mb-2">Steps:</h4>
                                {instruction.steps.map((step, stepIndex) => (
                                  <div
                                    key={stepIndex}
                                    className="flex items-center space-x-2 mb-2 last:mb-0"
                                  >
                                    <div>
                                      {getStatusIcon(
                                        isApproved
                                          ? step.status
                                          : isDeclined
                                          ? "failed"
                                          : "idle"
                                      )}
                                    </div>
                                    <span>{step.action}</span>
                                  </div>
                                ))}
                              </CardContent>
                            </Card>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  ))}
                </div>
                {!isApproved && !isDeclined && (
                  <div className="mt-4 flex justify-end space-x-2">
                    <Button
                      onClick={() => {
                        setIsApproved(false);
                        setIsDeclined(true);
                      }}
                      className="bg-red-500 hover:bg-red-600 text-white"
                    >
                      Decline
                    </Button>
                    <Button
                      onClick={() => {
                        setIsApproved(true);
                        setIsDeclined(false);
                      }}
                      className="bg-green-500 hover:bg-green-600 text-white"
                    >
                      Approve
                    </Button>
                  </div>
                )}
              </Card>
            </div>
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
          const truncatedAddress = truncateAddress(part);
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
