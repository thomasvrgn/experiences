import { expandGlob } from 'https://deno.land/std/fs/mod.ts';
import { File } from './typings/file.ts';

async function main() {
    try {
      const files: Array<File> = [];
      for await (const file of expandGlob('src/**/*.ts')) {
        files.push(file);
      }
      const watcher = Deno.watchFs(files.map((x: File) => x.path));
      console.log('[START] Deno is now watching typescript files...')
      let state = false;
      for await (const event of watcher) {
        if (state) {
          state = false;
          continue;
        };
        state = true;
        console.log(`[RUN] File ${event.paths[0].split('/').slice(-1)[0]} ran...`)
        Deno.run({
          cmd: ['deno', 'run', '--allow-read', '--unstable', event.paths[0]]
        });
        console.log(`[SUCCESS] Clean exit...`)
      }
    } catch (exception) {
      throw exception;
    }
    return;
}

main()