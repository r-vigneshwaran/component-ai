import { createOllama } from "ollama-ai-provider-v2";

const ollama = createOllama({});

export const codellama = ollama("codellama:7b-instruct");
