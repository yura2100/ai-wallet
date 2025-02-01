import { openai } from "@ai-sdk/openai"
import { streamText } from "ai"

export const runtime = "edge"

export async function POST(req: Request) {
  const { messages } = await req.json()
  const result = streamText({
    model: openai("gpt-4-turbo"),
    messages,
    system:
      "You are an AI assistant for a crypto wallet application. Help users with their questions about cryptocurrency, transactions, and wallet management.",
  })
  return result.toDataStreamResponse()
}

