import * as Color from 'https://deno.land/std@0.72.0/fmt/colors.ts';
import { configuration } from './config.ts';
import { Configuration } from '../typings/configuration.ts';


export async function watch(): Promise<void> {
  const configurationCorrected: Configuration = await configuration();
  let extensionMatched: boolean = false;
  for (const extension of configurationCorrected.extensions) {
    if (configurationCorrected.pattern.split('/').slice(-1)[0].match(extension)) {
      extensionMatched = true;
      break;
    }
  }
  if (!extensionMatched) {
    console.log(Color.red(`[denomon] File not matching extensions ${configurationCorrected.extensions}`))
    return console.log(Color.red('[denomon] app crashed - waiting for file changes before starting...'))
  }
  try {
    const watcher = Deno.watchFs(configurationCorrected.pattern);
    let state = false;
    await run(configurationCorrected);
    for await (const event of watcher) {
      if (state) {
        state = false;
        continue;
      }
      state = true;
      console.log(Color.green(`[denomon] restarting due to changes...`));
      await run(configurationCorrected);
    }
  } catch (exception) {
    throw exception;
  }
}

export async function run(config: Configuration) {
  console.log(Color.green(`[denomon] starting \`deno ${config.pattern}\``));
  const run = Deno.run({
    cmd: ['deno', 'run', '--allow-read', '--unstable', '--no-check', config.pattern],
    stdout: 'piped',
    stderr: 'piped',
  });
  const content: Uint8Array = await run.output();
  const error: Uint8Array  = await run.stderrOutput();
  if (error.length > 0) {
    const errorContent: string = new TextDecoder('utf-8').decode(error);
    const encodedError: Uint8Array = new TextEncoder().encode(errorContent);
    await Deno.stdout.write(encodedError);
    return console.log(Color.red('[denomon] app crashed - waiting for file changes before starting...'))
  }
  await Deno.stdout.write(content);
  console.log(Color.green(`[denomon] clean exit - waiting for changes before restart`));
}