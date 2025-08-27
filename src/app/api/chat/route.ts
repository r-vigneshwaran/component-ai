import { streamText } from "ai";
import { createOllama } from "ollama-ai-provider-v2";

const aiChat = async (req: Request): Promise<Response | undefined> => {
  const { prompt } = await req.json();

  const ollama = createOllama({});
  const result = streamText({
    model: ollama("codellama:7b-instruct"),
    messages: [
      {
        role: "user",
        content: `You are an expert React developer. Generate a complete, functional React component based on this description: "${prompt}".

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
      },
    ],
  });

  return result.toTextStreamResponse();
};

export const POST = aiChat;
