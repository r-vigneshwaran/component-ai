import { generateText } from "ai";
import { codellama } from "./ollama-provider";

const generateComponent = async (prompt: string) => {
  const { text } = await generateText({
    model: codellama,
    providerOptions: { ollama: { think: true } },
    prompt:
      "Write a vegetarian lasagna recipe for 4 people, but really think about it",
  });

  return text;
};

export default generateComponent;
