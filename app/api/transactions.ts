import { getTransactions } from "@/lib/okx-client";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";

const app = new Hono().get(
  "/",
  zValidator(
    "query",
    z.object({
      address: z.string(),
      chain: z.string().transform((val) => Number(val)),
    })
  ),
  async (c) => {
    const { address, chain } = c.req.valid("query");
    const response = await getTransactions(address, chain);
    return c.json(response);
  }
);

export default app;
