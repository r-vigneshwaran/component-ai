import { streamText } from "ai";
import { createOllama } from "ollama-ai-provider-v2";

const aiChat = async (req: Request): Promise<Response | undefined> => {
  const { prompt } = await req.json();

  const ollama = createOllama({});
  const result = streamText({
    model: ollama("codellama:7b-instruct"),
    messages: [
      {
        role: "system",
        content: `Create a simple React component based on the user's description.

IMPORTANT: Return ONLY the component code. NO explanations, NO comments, NO placeholder text, NO additional text.

Requirements:
- Use basic React (no hooks, no TypeScript)
- Make it stylish, minimal, modern, and appealing
- Use Tailwind CSS for styling
- Do not export the component
- Define the component as 'function Component() { ... }'
- Immediately render it below with '<Component />'
- Do not import anything (not even React)

Output format (replace with REAL JSX, not placeholders):

function Component() {
  return (
    <div className="...">
      <!-- Actual JSX content generated here -->
    </div>
  );
}

<Component />`,
      },
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  return result.toTextStreamResponse();
};

export const POST = aiChat;
