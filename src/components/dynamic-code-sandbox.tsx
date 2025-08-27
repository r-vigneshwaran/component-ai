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
  // This interface is intentionally empty as no props are currently needed
  // but it provides a foundation for future props
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
    code,
  };

  editor: EditorInstance | null = null;

  el: HTMLDivElement | null = null;

  componentDidMount() {
    if (this.el) {
      this.editor = createEditor(this.el);
      this.editor.run(code);
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
