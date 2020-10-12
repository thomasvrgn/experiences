export async function readFile(path: string, encoding: string = 'utf-8'): Promise<string> {
  try {
    const content: Uint8Array = await Deno.readFile(path);
    return new TextDecoder(encoding).decode(content);
  } catch (exception) {
    throw exception;
  }
}
