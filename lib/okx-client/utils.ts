import { HmacSHA256, enc } from "crypto-js";
import { z } from "zod";

const BASE_URL = "https://www.okx.com";

const ENDPOINTS = {
  getAllTokenBalances: "/api/v5/wallet/asset/all-token-balances-by-address",
  getTransactions: "/api/v5/wallet/post-transaction/transactions-by-address",
  getTotalBalanceUsd: "/api/v5/wallet/asset/total-value-by-address",
};
type EndpointName = keyof typeof ENDPOINTS;

const config = {
  apiKey: process.env.NEXT_PUBLIC_OKX_API_KEY ?? "",
  secretKey: process.env.NEXT_PUBLIC_OKX_SECRET_KEY ?? "",
  projectId: process.env.NEXT_PUBLIC_OKX_PROJECT_ID ?? "",
  passphrase: process.env.NEXT_PUBLIC_OKX_PASSPHRASE ?? "",
};

export function getUrl<T extends EndpointName>(
  endpoint: T,
  params: URLSearchParams
) {
  const endpointWithParams = `${ENDPOINTS[endpoint]}?${params.toString()}`;
  const requestUrl = `${BASE_URL}${endpointWithParams}`;

  return { endpointWithParams, requestUrl };
}

export function getHeaders(endpointWithParams: string, method: string) {
  const timestamp = new Date().toISOString();

  const hash = HmacSHA256(
    timestamp + method + endpointWithParams,
    config.secretKey
  );
  const signature = enc.Base64.stringify(hash);

  return {
    "Content-Type": "application/json",
    "OK-ACCESS-KEY": config.apiKey,
    "OK-ACCESS-SIGN": signature,
    "OK-ACCESS-TIMESTAMP": timestamp,
    "OK-ACCESS-PASSPHRASE": config.passphrase,
    "OK-ACCESS-PROJECT": config.projectId,
  };
}

export function createResponseSchema<T extends z.ZodSchema>(schema: T) {
  return z.object({
    code: z.string(),
    msg: z.string(),
    data: z.array(schema),
  });
}
