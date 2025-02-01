import { getAllTokenBalances } from "@/lib/okx-client";
import { getTotalBalanceUsd } from "@/lib/okx-client/get-total-balance-usd";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";

const app = new Hono()
  .get(
    "/tokens",
    zValidator(
      "query",
      z.object({
        address: z.string(),
        chain: z.string().transform((val) => Number(val)),
      })
    ),
    async (c) => {
      const { address, chain } = c.req.valid("query");
      const response = await getAllTokenBalances(address, chain);
      return c.json(response);
    }
  )
  .get(
    "/total",
    zValidator(
      "query",
      z.object({
        address: z.string(),
        chain: z.string().transform((val) => Number(val)),
      })
    ),
    async (c) => {
      const { address, chain } = c.req.valid("query");
      const response = await getTotalBalanceUsd(address, chain);
      return c.json(response);
    }
  );

export default app;
