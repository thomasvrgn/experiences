import { readFile } from "../readFile/index.ts";
import { Node } from "./typings/node.ts";

export class Parser {
  private readonly path: string;
  private content: string = '';
  private formatted: string[] = [];
  private ast: Node = {
    type: 'Program',
    raw: '',
    line: -1,
    tabs: -1,
    children: [],
  };
  private tabSize: number = 0;
  private oldTabSize: number = -1;
  private state: number = -1;

  private getSizeTabs(line: string): number {
    if (!this.tabSize) return 0;
    const matched: string[] = line.match(/^\s+/) || [''];
    return matched[0].length / this.tabSize;
  }

  private getParent(ast: Node, iterations: number): Node {
    if (iterations === 0) return ast;
    else {
      if (!ast.parent) return ast;
      return this.getParent(ast.parent, iterations - 1);
    }
  }

  private static parse: (code: string, index: number, ast: Node) => (typeof Parser.parse | null);

  constructor(path: string) {
    this.path = path;
  }

  public async init(): Promise<Node> {
    this.content = await readFile(this.path);
    this.formatted = this.content
      .split(/\r?\n/g)
      .filter((x: string) => x.trim().length > 0);
    this.parse(this.formatted, 0, this.ast);
    return this.ast;
  }

  private parse(code: string[], index: number, ast: Node): typeof Parser.parse | Node {
    const line: string = code[index];
    if (!line) return ast;
    if (!this.tabSize || this.tabSize === 0) {
      const matched: string[] = line.match(/^\s+/) || [''];
      this.tabSize = matched[0].length;
    }
    const tabs: number = this.getSizeTabs(line);
    if (this.oldTabSize > tabs) this.state = 0
    else if (this.oldTabSize === tabs) this.state = 2;
    else if (this.oldTabSize < tabs) this.state = 1;
    const parentsNumber: number = Math.abs(tabs - this.oldTabSize);
    this.oldTabSize = tabs;
    const trimLine: string = line.trim();
    if (this.state === 0) ast = this.getParent(ast, parentsNumber);
    if (trimLine.endsWith(':')) {
      ast.children.push({
        type: 'Node',
        raw: trimLine,
        line: index,
        tabs: tabs,
        children: [],
        parent: ast,
      });
      return this.parse(code, index + 1, ast.children.slice(-1)[0]);
    }
    ast.children.push({
      type: 'Block',
      raw: trimLine,
      line: index,
      tabs: tabs,
      children: [],
      parent: ast,
    });
    return this.parse(code, index + 1, ast);
  }

  public printAST(ast: Node): void {
    if (!ast) return;
    for (const child of ast.children) {
      const tabs: string = new Array(child.tabs).fill(' '.repeat(this.tabSize)).join('');
      if (child.raw.endsWith(':')) console.log(tabs + child.raw.slice(0, child.raw.length - 1) + ' {');
      else console.log(tabs + child.raw);
      this.printAST(child);
      if (child.raw.endsWith(':')) console.log(tabs + '}');
    }
  }
}

const parser: Parser = new Parser('./src/tabdownParser/code.txt');
const ast: Node = await parser.init();
//parser.printAST(ast);
console.log('Hello world!')