import { z } from "zod";
import { createResponseSchema, getHeaders, getUrl } from "./utils";

const tokenBalancesSchema = z.object({
  chainIndex: z.string().transform((value) => Number(value)),
  tokenAddress: z.string(),
  symbol: z.string(),
  balance: z.string(),
  tokenPrice: z.string().transform((value) => Number(value)),
  tokenType: z.string(),
});

const getAllTokenBalancesSchema = createResponseSchema(
  z.object({ tokenAssets: z.array(tokenBalancesSchema) })
);

export type Token = z.infer<typeof tokenBalancesSchema> & {
  usdBalance: number;
};

export async function getAllTokenBalances(
  address: string,
  chain: number
): Promise<Token[] | null> {
  try {
    const params = new URLSearchParams();
    params.append("address", address);
    params.append("chains", chain.toString());

    const { endpointWithParams, requestUrl } = getUrl(
      "getAllTokenBalances",
      params
    );
    const method = "GET";
    const headers = getHeaders(endpointWithParams, method);

    const response = await fetch(requestUrl, { headers, method });
    const responseBody = await response.json();

    const { data } = getAllTokenBalancesSchema.parse(responseBody);
    const tokenAssets = data[0]?.tokenAssets ?? null;

    if (!tokenAssets) return null;

    return tokenAssets.map((token) => ({
      ...token,
      usdBalance: Number(token.balance) * token.tokenPrice,
    }));
  } catch (err) {
    console.error(err);
    throw err;
  }
}
