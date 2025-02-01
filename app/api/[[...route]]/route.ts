import { Hono } from "hono";
import { handle } from "hono/vercel";

import balances from "../balances";
import chat from "../chat";
import transactions from "../transactions";

const app = new Hono()
  .basePath("/api")
  .route("/balances", balances)
  .route("transactions", transactions)
  .route("/chat", chat);

export const GET = handle(app);
export const POST = handle(app);

export type AppType = typeof app;
