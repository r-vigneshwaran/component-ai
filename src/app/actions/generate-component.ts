import { streamText } from "ai";
import { codellama } from "./ollama-provider";

export async function* generateComponent(prompt: string) {
  const { textStream } = await streamText({
    model: codellama,
    prompt: `You are an expert React developer. Generate a complete, functional React component based on this description: "${prompt}".

Requirements:
- Use modern React with hooks
- Include proper TypeScript types
- Make it visually appealing with CSS
- Ensure it's production-ready
- Return ONLY the component code, no explanations

Example format:
\`\`\`tsx
import React from 'react';

interface ComponentProps {
  // props here
}

export default function ComponentName({ ...props }: ComponentProps) {
  // component logic here
  return (
    // JSX here
  );
}
\`\`\``,
  });

  for await (const delta of textStream) {
    yield delta;
  }
}
