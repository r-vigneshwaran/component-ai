import { streamText } from "ai";
import { createOllama } from "ollama-ai-provider-v2";

const aiChat = async (req: Request): Promise<Response | undefined> => {
  const { messages } = await req.json();

  const ollama = createOllama({});
  const result = streamText({
    model: ollama("codellama:7b-instruct"),
    messages,
  });

  return result.toTextStreamResponse();
};

export const POST = aiChat;
