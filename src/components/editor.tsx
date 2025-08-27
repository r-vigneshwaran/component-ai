import React from "react";
import { createRoot, Root } from "react-dom/client";
import ObjPath from "object-path";

import * as Acorn from "acorn";

import { generate as generateJs } from "escodegen";
import { transform as babelTransform } from "@babel/standalone";

type ReactType = typeof React;

interface ASTNode {
  type: string;
  body: ASTNode[];
  expression?: {
    callee?: {
      object?: {
        name?: string;
      };
      property?: {
        name?: string;
      };
    };
  };
}

interface EditorInstance {
  compile: (
    code: string
  ) =>
    | ((
        React: ReactType,
        render: (node: React.ReactElement) => void,
        require: (moduleName: string) => unknown
      ) => void)
    | undefined;
  run: (code: string) => void;
  getCompiledCode: (code: string) => string;
}

function isReactNode(node: ASTNode): boolean {
  const type = node.type; //"ExpressionStatement"
  const obj = ObjPath.get(node, "expression.callee.object.name");
  const func = ObjPath.get(node, "expression.callee.property.name");
  return (
    type === "ExpressionStatement" &&
    obj === "React" &&
    func === "createElement"
  );
}

export function findReactNode(ast: ASTNode): ASTNode | undefined {
  const { body } = ast;
  return body.find(isReactNode);
}

export function createEditor(
  domElement: HTMLElement,
  moduleResolver: (moduleName: string) => unknown = () => null
): EditorInstance {
  let root: Root | null = null;

  function render(node: React.ReactElement) {
    if (!root) {
      root = createRoot(domElement);
    }
    root.render(node);
  }

  function require(moduleName: string) {
    return moduleResolver(moduleName);
  }

  function getWrapperFunction(
    code: string
  ):
    | ((
        React: ReactType,
        render: (node: React.ReactElement) => void,
        require: (moduleName: string) => unknown
      ) => void)
    | undefined {
    try {
      // 1. transform code
      const babelResult = babelTransform(code, {
        presets: ["es2015", "react"],
      });
      if (!babelResult.code) {
        throw new Error("Babel transformation failed");
      }
      const tcode = babelResult.code;

      // 2. get AST
      const ast = Acorn.parse(tcode, {
        sourceType: "module",
        ecmaVersion: 2020,
      });

      // 3. find React.createElement expression in the body of program
      const rnode = findReactNode(ast as unknown as ASTNode);

      if (rnode) {
        const nodeIndex = (ast as unknown as ASTNode).body.indexOf(rnode);
        // 4. convert the React.createElement invocation to source and remove the trailing semicolon
        const createElSrc = generateJs(rnode as unknown as Acorn.Node).slice(
          0,
          -1
        );
        // 5. transform React.createElement(...) to render(React.createElement(...)),
        // where render is a callback passed from outside
        const renderCallAst = Acorn.parse(`render(${createElSrc})`, {
          sourceType: "module",
          ecmaVersion: 2020,
        }).body[0];

        (ast as unknown as ASTNode).body[nodeIndex] =
          renderCallAst as unknown as ASTNode;
      }

      // 6. create a new wrapper function with all dependency as parameters
      return new Function("React", "render", "require", generateJs(ast)) as (
        React: ReactType,
        render: (node: React.ReactElement) => void,
        require: (moduleName: string) => unknown
      ) => void;
    } catch (ex) {
      // in case of exception render the exception message
      const error = ex as Error;
      render(<pre style={{ color: "red" }}>{error.message}</pre>);
    }
  }

  return {
    // returns transpiled code in a wrapper function which can be invoked later
    compile(code: string) {
      return getWrapperFunction(code);
    },

    // compiles and invokes the wrapper function
    run(code: string) {
      const compiled = this.compile(code);
      if (compiled) {
        compiled(React, render, require);
      }
    },

    // just compiles and returns the stringified wrapper function
    getCompiledCode(code: string): string {
      const compiled = getWrapperFunction(code);
      return compiled ? compiled.toString() : "";
    },
  };
}
