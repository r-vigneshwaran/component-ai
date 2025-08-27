"use client";
import { useChat } from "@ai-sdk/react";
import { useState } from "react";

export default function CodeGenerator() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({});
  const [codeType, setCodeType] = useState("react-component");

  const generateCode = async (prompt) => {
    const enhancedPrompt = `Generate ${codeType}: ${prompt}
    
Requirements:
- Use modern React with hooks
- Include TypeScript if applicable
- Add proper error handling
- Use Tailwind CSS for styling
- Include comments explaining the logic`;

    handleSubmit(
      { preventDefault: () => {} },
      { data: { content: enhancedPrompt } }
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">React Code Generator</h1>

      {/* Code Type Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Code Type:</label>
        <select
          value={codeType}
          onChange={(e) => setCodeType(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="react-component">React Component</option>
          <option value="custom-hook">Custom Hook</option>
          <option value="api-route">API Route</option>
          <option value="utility-function">Utility Function</option>
        </select>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={handleInputChange}
            placeholder="Describe what you want to build..."
            className="flex-1 border rounded px-3 py-2"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-500 text-white px-6 py-2 rounded disabled:opacity-50"
          >
            {isLoading ? "Generating..." : "Generate"}
          </button>
        </div>
      </form>

      {/* Quick Examples */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Quick Examples:</h3>
        <div className="flex flex-wrap gap-2">
          {[
            "Todo list with local storage",
            "Image gallery with modal",
            "Form with validation",
            "Dashboard with charts",
            "Shopping cart component",
          ].map((example) => (
            <button
              key={example}
              onClick={() => generateCode(example)}
              className="bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded text-sm"
              disabled={isLoading}
            >
              {example}
            </button>
          ))}
        </div>
      </div>

      {/* Messages Display */}
      <div className="space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`p-4 rounded ${
              message.role === "user" ? "bg-blue-50" : "bg-gray-50"
            }`}
          >
            <div className="font-semibold mb-2">
              {message.role === "user" ? "You:" : "AI:"}
            </div>
            <div className="whitespace-pre-wrap">
              {message.role === "assistant" ? (
                <CodeBlock content={message.content} />
              ) : (
                message.content
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CodeBlock({ content }) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative">
      <button
        onClick={copyToClipboard}
        className="absolute top-2 right-2 bg-gray-700 text-white px-2 py-1 rounded text-xs"
      >
        {copied ? "Copied!" : "Copy"}
      </button>
      <pre className="bg-gray-800 text-white p-4 rounded overflow-x-auto">
        <code>{content}</code>
      </pre>
    </div>
  );
}
