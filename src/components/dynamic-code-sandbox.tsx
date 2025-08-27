import "./styles.css";
import React from "react";
import { createEditor } from "./editor";
import debounce from "debounce";

// default code
const code = `import x from 'x';

import { useEffect } from "react";

function Greet() {
  
  return <span style={{color:"red", fontSize: "12px"}}>Hello World! New Word</span>
}

<Greet />
`;

interface DynamicCodeSandboxProps {
  // Code to be executed in the sandbox
  code?: string;
  // Optional initial code if no code prop is provided
  initialCode?: string;
}

interface DynamicCodeSandboxState {
  code: string;
}

interface EditorInstance {
  run: (code: string) => void;
}

class DynamicCodeSandbox extends React.Component<
  DynamicCodeSandboxProps,
  DynamicCodeSandboxState
> {
  state: DynamicCodeSandboxState = {
    code:
      this.props.code ||
      this.props.initialCode ||
      `import x from 'x';

import { useEffect } from "react";

function Greet() {
  
  return <span style={{color:"red", fontSize: "12px"}}>Hello World! New Word</span>
}

<Greet />
`,
  };

  editor: EditorInstance | null = null;

  el: HTMLDivElement | null = null;

  componentDidMount() {
    if (this.el) {
      this.editor = createEditor(this.el);
      this.editor.run(this.state.code);
    }
  }

  componentDidUpdate(prevProps: DynamicCodeSandboxProps) {
    // Update state if code prop changes
    if (prevProps.code !== this.props.code && this.props.code) {
      this.setState({ code: this.props.code });
      if (this.editor) {
        this.editor.run(this.props.code);
      }
    }
  }

  onCodeChange = ({
    target: { value },
  }: React.ChangeEvent<HTMLTextAreaElement>) => {
    this.setState({ code: value });
    this.run(value);
  };

  run = debounce((codeValue: string) => {
    this.editor?.run(codeValue);
  }, 500);

  render() {
    const { code } = this.state;
    return (
      <div className="app">
        <div className="split-view">
          <div className="code-editor">
            <textarea value={code} onChange={this.onCodeChange} />
          </div>
          <div
            className="preview"
            ref={(el) => {
              this.el = el;
            }}
          />
        </div>
      </div>
    );
  }
}

export default DynamicCodeSandbox;
