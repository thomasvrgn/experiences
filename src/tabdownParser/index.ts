import { readFile } from "../readFile/index.ts";

export class Parser {
  private readonly path: string;
  private content: string = '';
  private formated: string[] = [];

  constructor(path: string) {
    this.path = path;
  }

  public async init() {
    this.content = await readFile(this.path);
    this.formated = this.content
      .split(/\r?\n/g)
      .filter((x: string) => x.trim().length > 0);
    console.log(this.formated);
  }
}

new Parser('./src/tabdownParser/code.txt').init();
