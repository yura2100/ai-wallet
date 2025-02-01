import { getTransactions } from "@/lib/okx-client";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";

const app = new Hono().get(
  "/",
  zValidator("query", z.object({ address: z.string(), chain: z.string() })),
  async (c) => {
    const address = c.req.query("address");
    const chain = Number(c.req.query("chain"));

    if (!address || !chain) {
      throw new Error("Missing required parameters");
    }

    const response = await getTransactions(address, chain);
    return c.json(response);
  }
);

export default app;
