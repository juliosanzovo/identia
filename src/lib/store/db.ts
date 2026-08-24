import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");

export function dataPath(...segments: string[]): string {
  return path.join(DATA_DIR, ...segments);
}

export async function ensureDataDir(): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true });
  await mkdir(dataPath("uploads"), { recursive: true });
}

export async function readJson<T>(filename: string, fallback: T): Promise<T> {
  await ensureDataDir();
  try {
    const raw = await readFile(dataPath(filename), "utf-8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export async function writeJson<T>(filename: string, data: T): Promise<void> {
  await ensureDataDir();
  await writeFile(dataPath(filename), JSON.stringify(data, null, 2), "utf-8");
}
