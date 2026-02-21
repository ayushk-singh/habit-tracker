import "expo-sqlite/localStorage/install";

type Listener = () => void;
const listeners = new Map<string, Set<Listener>>();
const cache = new Map<string, unknown>();

export const storage = {
  get<T>(key: string, defaultValue: T): T {
    if (cache.has(key)) return cache.get(key) as T;
    const raw = localStorage.getItem(key);
    const value = raw ? (JSON.parse(raw) as T) : defaultValue;
    cache.set(key, value);
    return value;
  },

  set<T>(key: string, value: T): void {
    cache.set(key, value);
    localStorage.setItem(key, JSON.stringify(value));
    listeners.get(key)?.forEach((fn) => fn());
  },

  subscribe(key: string, listener: Listener): () => void {
    if (!listeners.has(key)) listeners.set(key, new Set());
    listeners.get(key)!.add(listener);
    return () => listeners.get(key)?.delete(listener);
  },
};
