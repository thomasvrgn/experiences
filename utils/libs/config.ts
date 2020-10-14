import { Configuration } from '../typings/configuration.ts';

export async function configuration(): Promise<Configuration> {
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

  return configurationCorrected;
}