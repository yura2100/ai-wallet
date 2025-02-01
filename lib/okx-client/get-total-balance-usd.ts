import { z } from "zod";
import { createResponseSchema, getHeaders, getUrl } from "./utils";

const getTotalBalanceUsdSchema = createResponseSchema(
  z.object({ totalValue: z.string().transform((value) => Number(value)) })
);

export async function getTotalBalanceUsd(address: string, chain: number) {
  try {
    const params = new URLSearchParams();
    params.append("address", address);
    params.append("chains", chain.toString());

    const { endpointWithParams, requestUrl } = getUrl(
      "getTotalBalanceUsd",
      params
    );
    const method = "GET";
    const headers = getHeaders(endpointWithParams, method);

    const response = await fetch(requestUrl, { headers, method });
    const responseBody = await response.json();

    const { data } = getTotalBalanceUsdSchema.parse(responseBody);

    return {
      totalBalanceUsd: data[0]?.totalValue ?? 0,
    };
  } catch (err) {
    console.error(err);
    throw err;
  }
}
