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
        chain: z.string(),
      })
    ),
    async (c) => {
      const address = c.req.query("address");
      const chain = Number(c.req.query("chain"));

      if (!address || !chain) {
        throw new Error("Missing required parameters");
      }

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
        chain: z.string(),
      })
    ),
    async (c) => {
      const address = c.req.query("address");
      const chain = Number(c.req.query("chain"));

      if (!address || !chain) {
        throw new Error("Missing required parameters");
      }

      const response = await getTotalBalanceUsd(address, chain);
      console.log(response);
      return c.json(response);
    }
  );

export default app;
