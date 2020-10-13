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

  private getSizeTabs(line: string): number {
    if (!this.tabSize) return 0;
    const matched: string[] = line.match(/^\s+/) || [''];
    return matched[0].length / this.tabSize;
  }

  private static parse: (code: string, index: number, ast: Node) => (typeof Parser.parse | null);

  constructor(path: string) {
    this.path = path;
  }

  public async init() {
    this.content = await readFile(this.path);
    this.formatted = this.content
      .split(/\r?\n/g)
      .filter((x: string) => x.trim().length > 0);
    this.parse(this.formatted, 0, this.ast);
  }

  private parse(code: string[], index: number, ast: Node): typeof Parser.parse | Node {
    const line: string = code[index];
    if (!line) return ast;
    console.log(line);
    return this.parse(code, index + 1, ast);
  }
}

new Parser('./src/tabdownParser/code.txt').init();
