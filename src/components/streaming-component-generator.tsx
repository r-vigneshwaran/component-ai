"use client";
import React, { useState, useRef, useEffect } from "react";
import { generateComponent } from "@/app/actions/generate-component";
import { createEditor } from "./editor";

interface StreamingComponentGeneratorProps {
  initialPrompt?: string;
}

export default function StreamingComponentGenerator({
  initialPrompt = "Create a beautiful button component with hover effects",
}: StreamingComponentGeneratorProps) {
  const [prompt, setPrompt] = useState(initialPrompt);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCode, setGeneratedCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<{ run: (code: string) => void } | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setError(null);
    setGeneratedCode("");

    try {
      const codeStream = generateComponent(prompt);
      let fullCode = "";

      for await (const chunk of codeStream) {
        fullCode += chunk;
        setGeneratedCode(fullCode);
      }

      // Extract code from markdown if present
      const codeMatch = fullCode.match(/```(?:tsx|ts|jsx|js)?\n([\s\S]*?)```/);
      const extractedCode = codeMatch ? codeMatch[1] : fullCode;

      if (extractedCode) {
        setGeneratedCode(extractedCode);
        // Run the generated code in the preview
        if (editorRef.current) {
          editorRef.current.run(extractedCode);
        }
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to generate component"
      );
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    if (previewRef.current) {
      editorRef.current = createEditor(previewRef.current);
    }
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          AI React Component Generator
        </h1>
        <p className="text-gray-600">
          Describe your component and watch it come to life with CodeLlama
        </p>
      </div>

      <div className="flex gap-4">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe the React component you want to create..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={isGenerating}
        />
        <button
          onClick={handleGenerate}
          disabled={isGenerating || !prompt.trim()}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerating ? "Generating..." : "Generate"}
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Generated Code
          </h2>
          <div className="bg-gray-900 rounded-lg p-4 h-96 overflow-auto">
            <pre className="text-green-400 text-sm">
              <code>
                {generatedCode ||
                  "// Your generated component will appear here..."}
              </code>
            </pre>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">Live Preview</h2>
          <div className="border border-gray-200 rounded-lg p-4 h-96 bg-white">
            <div ref={previewRef} className="w-full h-full" />
          </div>
        </div>
      </div>

      {isGenerating && (
        <div className="text-center text-gray-600">
          <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-2"></div>
          Generating your component...
        </div>
      )}
    </div>
  );
}
