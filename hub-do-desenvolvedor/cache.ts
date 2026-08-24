import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";

const TTL_MS = 24 * 60 * 60 * 1000;
const CACHE_FILE = path.join(process.cwd(), "data", "hub-cache.json");

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

type CacheStore = Record<string, CacheEntry<unknown>>;

const memory = new Map<string, CacheEntry<unknown>>();
let persistQueue: Promise<void> = Promise.resolve();

async function loadStore(): Promise<CacheStore> {
  try {
    await mkdir(path.dirname(CACHE_FILE), { recursive: true });
    const raw = await readFile(CACHE_FILE, "utf-8");
    return JSON.parse(raw) as CacheStore;
  } catch {
    return {};
  }
}

function schedulePersist(store: CacheStore): void {
  persistQueue = persistQueue.then(async () => {
    await mkdir(path.dirname(CACHE_FILE), { recursive: true });
    await writeFile(CACHE_FILE, JSON.stringify(store, null, 2), "utf-8");
  });
}

function isFresh<T>(entry: CacheEntry<T>): boolean {
  return entry.expiresAt > Date.now();
}

export async function getCached<T>(key: string): Promise<T | null> {
  const mem = memory.get(key) as CacheEntry<T> | undefined;
  if (mem && isFresh(mem)) return mem.data;

  const store = await loadStore();
  const entry = store[key] as CacheEntry<T> | undefined;
  if (!entry || !isFresh(entry)) return null;

  memory.set(key, entry);
  return entry.data;
}

export async function setCached<T>(key: string, data: T): Promise<void> {
  const entry: CacheEntry<T> = { data, expiresAt: Date.now() + TTL_MS };
  memory.set(key, entry);

  const store = await loadStore();
  store[key] = entry;
  schedulePersist(store);
}

export function cacheKey(tipo: "cpf" | "cnpj" | "cep", digits: string): string {
  return `${tipo}:${digits}`;
}
