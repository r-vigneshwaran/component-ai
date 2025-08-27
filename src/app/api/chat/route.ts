// import { ollama } from "@ai-sdk/ollama";
// import { streamText } from "ai";

// export async function POST(req) {
//   const { messages } = await req.json();

//   const result = await streamText({
//     model: ollama("codellama:7b-instruct"), // or 'codellama:7b'
//     messages,
//     temperature: 0.1, // Lower for code generation
//     maxTokens: 2000,
//   });

//   return result.toAIStreamResponse();
// }

import { streamText } from "ai";
import { createOllama } from "ollama-ai-provider-v2";

const ollama = createOllama({
  baseURL: "http://localhost:11434", // Remove /api from here
});

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: ollama("codellama:7b-instruct"), // Specify the model you pulled
    messages,
  });

  return result.toTextStreamResponse();
}
