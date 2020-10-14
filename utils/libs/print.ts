import * as Color from 'https://deno.land/std@0.72.0/fmt/colors.ts';
import { configuration } from './config.ts';
import { Configuration } from '../typings/configuration.ts';

export async function print() {
  const configurationCorrected: Configuration = await configuration();

  // Printing configuration
  console.log(Color.yellow(`[denomon] ${configurationCorrected.version}`));
  console.log(Color.yellow(`[denomon] watching path(s): ${configurationCorrected.pattern}`));
  console.log(Color.yellow(`[denomon] watching extensions: ${configurationCorrected.extensions}`));
}