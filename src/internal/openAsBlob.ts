import { readFile } from "node:fs/promises";

export default async function openAsBlob(
  path: string | URL | Buffer,
  options: { type?: string } | undefined = undefined
): Promise<Blob> {
  const bytes = await readFile(path);
  return new Blob([bytes], options);
}
