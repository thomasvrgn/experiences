import { readFile } from "../readFile/index.ts";
import { Node } from "./typings/node.ts";

export class Parser {
  private readonly path: string;
  private content: string = '';
  private formated: string[] = [];
  private ast: Node = {
    type: 'Program',
    raw: '',
    line: -1,
    tabs: -1,
    children: [],
  };
  private static parse: (code: string, index: number, ast: Node) => (typeof Parser.parse | null);

  constructor(path: string) {
    this.path = path;
  }

  public async init() {
    this.content = await readFile(this.path);
    this.formated = this.content
      .split(/\r?\n/g)
      .filter((x: string) => x.trim().length > 0);
    this.parse(this.formated, 0, this.ast);
  }

  public parse(code: string[], index: number, ast: Node): typeof Parser.parse | Node {
    const line: string = code[index];
    if (!line) return ast;
    console.log(line);
    return this.parse(code, index + 1, ast);
  }
}

new Parser('./src/tabdownParser/code.txt').init();
