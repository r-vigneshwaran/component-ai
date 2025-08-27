"use client";
import "./styles.css";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { createEditor } from "./editor";
import debounce from "debounce";

interface DynamicCodeSandboxProps {
  // Code to be executed in the sandbox
  code: string;
  // Optional initial code if no code prop is provided
  initialCode?: string;
}

interface EditorInstance {
  run: (code: string) => void;
}

export default function DynamicCodeSandbox({
  code: codeProp,
  initialCode,
}: DynamicCodeSandboxProps) {
  const [code, setCode] = useState(
    codeProp ||
      initialCode ||
      `import x from 'x';

import { useEffect } from "react";

function Greet() {
  
  return <span style={{color:"red", fontSize: "12px"}}>Hello World! New Word</span>
}

<Greet />
`
  );

  const editorRef = useRef<EditorInstance | null>(null);
  const elRef = useRef<HTMLDivElement | null>(null);

  // Update code when prop changes
  useEffect(() => {
    if (codeProp && codeProp !== code) {
      setCode(codeProp);
      if (editorRef.current) {
        editorRef.current.run(codeProp);
      }
    }
  }, [codeProp, code]);

  // Initialize editor on mount
  useEffect(() => {
    if (elRef.current) {
      editorRef.current = createEditor(elRef.current);
      editorRef.current.run(code);
    }
  }, [code]);

  const onCodeChange = useCallback(
    ({ target: { value } }: React.ChangeEvent<HTMLTextAreaElement>) => {
      setCode(value);
      run(value);
    },
    []
  );

  const run = useCallback(
    debounce((codeValue: string) => {
      editorRef.current?.run(codeValue);
    }, 500),
    []
  );

  return (
    <div className="app">
      <div className="split-view">
        <div className="code-editor">
          <textarea value={code} onChange={onCodeChange} />
        </div>
        <div className="preview" ref={elRef} />
      </div>
    </div>
  );
}
