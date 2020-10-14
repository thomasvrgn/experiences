import { watch } from './libs/watch.ts';
import { printConfig } from './libs/printConfig.ts';

async function main() {
  await printConfig();
  await watch();
}

main()