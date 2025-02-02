import {ChatGroq} from "@langchain/groq";
import {z} from "zod";
import {Annotation, END, START, StateGraph} from "@langchain/langgraph/web";
import {match} from "ts-pattern";

const llm = new ChatGroq({
  model: "mixtral-8x7b-32768",
  temperature: 0,
  apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY,
});

const StateAnnotation = Annotation.Root({
  input: Annotation<string>,
  decision: Annotation<"transfer-native" | "transfer-erc20">,
  output: Annotation<any>,
});

const routeSchema = z.object({
  step: z.enum(["transfer-native", "transfer-erc20"]).describe(
    "The next step in the routing process",
  ),
});

const router = llm.withStructuredOutput(routeSchema);

async function llmCallRouter(state: typeof StateAnnotation.State) {
  const decision = await router.invoke([
    {
      role: "system",
      content: `
You are an expert extraction algorithm for crypto wallet.
You should extract type of user's intent based on request.
Route the input to ${routeSchema.shape.step.options.join(", ")} based on the user's request.
If user wants to transfer token with symbol/ticker 'ETH', you should route to transfer-native.
If user wants to transfer token with any symbol/ticker other than 'ETH' or with Ethereum address starting with '0x' (e.g. '0xa8ee8D3707Fc2e45594883e7b4D1f7d70665B451'), you should route to transfer-erc20.
Token symbol/ticker is usually 3-4 characters (e.g. 'ADA', 'BTC', 'USDC').
`
    },
    {
      role: "user",
      content: state.input
    },
  ]);

  return { decision: decision.step };
}

const transferNativeSchema = z.object({
  from: z.string().describe(
    "The Ethereum wallet address starting with '0x' or wallet name starting from '@' (e.g. '@Wallet 1' or '@Savings') to transfer from"
  ),
  to: z.string().describe(
    "The Ethereum wallet address starting with '0x' or wallet name starting from '@' (e.g. '@Wallet 1' or '@Savings') to transfer to"
  ),
  amount: z.string().describe(
    "The amount to transfer. This should be a decimal number (e.g. '1.5' or '100')"
  )
});

const transferNativeExtractor = llm.withStructuredOutput(transferNativeSchema);

async function llmCallExtractTransferNative(state: typeof StateAnnotation.State) {
  const result = await transferNativeExtractor.invoke([
    {
      role: "system",
      content: `
You are an expert extraction algorithm for crypto wallet.
You should extract information about users intention for transfering 'ETH'.
`
    },
    {
      role: "user",
      content: state.input
    },
  ]);

  return { output: result };
}

const transferERC20Schema = z.object({
  token: z.string().describe(
    "The Ethereum smart contract token address starting with '0x' or token symbol/ticker (e.g. 'BTC' or 'USDC')"
  ),
  from: z.string().describe(
    "The Ethereum wallet address starting with '0x' or wallet name starting from '@' (e.g. '@Wallet 1' or '@Savings') to transfer from"
  ),
  to: z.string().describe(
    "The Ethereum wallet address starting with '0x' or wallet name starting from '@' (e.g. '@Wallet 1' or '@Savings') to transfer to"
  ),
  amount: z.string().describe(
    "The amount to transfer. This should be a decimal number (e.g. '1.5' or '100')"
  )
});

const transferERC20Extractor = llm.withStructuredOutput(transferERC20Schema);

async function llmCallExtractTransferERC20(state: typeof StateAnnotation.State) {
  const result = await transferERC20Extractor.invoke([
    {
      role: "system",
      content: `
You are an expert extraction algorithm for crypto wallet.
You should extract information about users intention for transfering ERC20 token.
`
    },
    {
      role: "user",
      content: state.input
    },
  ]);

  return { output: result };
}

function routeDecision(state: typeof StateAnnotation.State) {
  return match(state.decision)
    .with("transfer-native", () => "llmCallExtractTransferNative")
    .with("transfer-erc20", () => "llmCallExtractTransferERC20")
    .exhaustive();
}

export const routerWorkflow = new StateGraph(StateAnnotation)
  .addNode("llmCallExtractTransferNative", llmCallExtractTransferNative)
  .addNode("llmCallExtractTransferERC20", llmCallExtractTransferERC20)
  .addNode("llmCallRouter", llmCallRouter)
  .addEdge(START, "llmCallRouter")
  .addConditionalEdges(
    "llmCallRouter",
    routeDecision,
    ["llmCallExtractTransferNative", "llmCallExtractTransferERC20"],
  )
  .addEdge("llmCallExtractTransferNative", END)
  .addEdge("llmCallExtractTransferERC20", END)
  .compile();
