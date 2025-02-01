import { z } from "zod";
import { createResponseSchema, getHeaders, getUrl } from "./utils";

const transactionSchema = z.object({
  chainIndex: z.string().transform((value) => Number(value)),
  txHash: z.string(),
  amount: z.string(),
  txTime: z
    .string()
    .transform((value) => Number(value))
    .transform((value) => new Date(value)),
  from: z.array(
    z.object({
      address: z.string(),
      amount: z.string(),
    })
  ),
  to: z.array(
    z.object({
      address: z.string(),
      amount: z.string(),
    })
  ),
  symbol: z.string(),
});
type RawTransaction = z.infer<typeof transactionSchema>;

export type Transaction = Omit<RawTransaction, "from" | "to"> & {
  from: { address: string; amount: string };
  to: { address: string; amount: string };
  type: "Received" | "Sent";
};

const getTransactionsSchema = createResponseSchema(
  z.object({ transactionList: z.array(transactionSchema), cursor: z.string() })
);

function mapTransaction(
  transaction: RawTransaction,
  userAddress: string
): Transaction {
  const mappedTransaction = {
    ...transaction,
    from: {
      address: transaction.from[0].address,
      amount: transaction.from[0].amount,
    },
    to: {
      address: transaction.to[0].address,
      amount: transaction.to[0].amount,
    },
  };

  const type =
    mappedTransaction.from.address === userAddress ? "Sent" : "Received";

  return { ...mappedTransaction, type };
}

export async function getTransactions(
  address: string,
  chain: number,
  cursor?: string
): Promise<Transaction[] | null> {
  const params = new URLSearchParams();
  params.append("address", address);
  params.append("chains", chain.toString());
  if (cursor) {
    params.append("cursor", cursor);
  }

  const { endpointWithParams, requestUrl } = getUrl("getTransactions", params);
  const method = "GET";
  const headers = getHeaders(endpointWithParams, method);

  const response = await fetch(requestUrl, { headers, method });
  const responseBody = await response.json();

  const { data } = getTransactionsSchema.parse(responseBody);

  const transactions = data[0]?.transactionList;
  if (!transactions) return null;

  return transactions.map((transaction) =>
    mapTransaction(transaction, address)
  );
}
