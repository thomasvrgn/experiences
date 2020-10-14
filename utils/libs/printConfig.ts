import { Configuration } from '../typings/configuration.ts';
import * as Color from 'https://deno.land/std@0.72.0/fmt/colors.ts';

export async function printConfig() {
  // Reading and parsing configuration file
  const contentArray: Uint8Array = await Deno.readFile('utils/config.json');
  const content: string = new TextDecoder('utf-8').decode(contentArray);
  const configuration: Configuration = JSON.parse(content);

  // Setting default configuration
  const configurationCorrected: Configuration = {
    version: configuration.version || '1.0.5',
    pattern: configuration.pattern || '**/*.ts',
    extensions: configuration.extensions || 'ts',
  };

  // Printing configuration
  console.log(Color.yellow(`[denomon] ${configurationCorrected.version}`));
  console.log(Color.yellow(`[denomon] watching path(s): ${configurationCorrected.pattern}`));
  console.log(Color.yellow(`[denomon] watching extensions: ${configurationCorrected.extensions}`));
}

printConfig();