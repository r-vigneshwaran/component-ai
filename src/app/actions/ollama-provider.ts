import { createOllama } from "ollama-ai-provider-v2";

const ollama = createOllama({
  baseURL: "http://localhost:11434",
});

export const codellama = ollama("codellama:7b-instruct");
