import { expandGlob } from 'https://deno.land/std/fs/mod.ts';
import { File } from './typings/file.ts';

async function main() {
    try {
      const files: Array<File> = [];
      for await (const file of expandGlob('**/*.ts')) {
        files.push(file);
      }
      console.log(files)
    } catch (exception) {
      console.log(exception);
    }
    return;
}

main()