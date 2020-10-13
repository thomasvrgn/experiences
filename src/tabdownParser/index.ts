import { readFile } from "../readFile/index.ts";

export class Parser {
  private readonly path: string;
  private content: string = '';

  constructor(path: string) {

    this.path = path;
  }

  public async init() {
    this.content = await readFile(this.path);
    console.log("init Parser");
  }

}

new Parser('./src/tabdownParser/code.txt').init();
