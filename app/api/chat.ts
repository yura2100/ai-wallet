import { openai } from "@ai-sdk/openai";
import { zValidator } from "@hono/zod-validator";
import { streamText } from "ai";
import { Hono } from "hono";
import { z } from "zod";

export const runtime = "edge";

const app = new Hono().post(
  "/",
  zValidator("json", z.object({ messages: z.string().array() })),
  async (c) => {
    const { messages } = await c.req.json();
    const result = streamText({
      model: openai("gpt-4-turbo"),
      messages,
      system:
        "You are an AI assistant for a crypto wallet application. Help users with their questions about cryptocurrency, transactions, and wallet management.",
    });
    return result.toDataStreamResponse();
  }
);

export default app;
