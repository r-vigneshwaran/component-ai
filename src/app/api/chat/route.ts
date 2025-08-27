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
        content: `Create a simple React component based on this description: "${prompt}".

IMPORTANT: Return ONLY the component code. NO explanations, NO comments, NO additional text.

Requirements:
- Use basic React (no hooks, no TypeScript)
- Make it look stylish, minimal, and modern
- Use Tailwind CSS for styling
- Do not export the component
- Instead, define the component and then immediately render it below using JSX
- Do not import any external files (like ./Button.css)
- The only allowed import is React itself

Output format:
function Component() {
  return (
    <div className="...">
      {/* JSX here */}
    </div>
  );
}

<Component />

Remember: ONLY the component code, no explanations or additional text.`,
      },
    ],
  });

  return result.toTextStreamResponse();
};

export const POST = aiChat;
