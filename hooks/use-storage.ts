import { useSyncExternalStore } from "react";
import { storage } from "@/utils/storage";

export function useStorage<T>(
  key: string,
  defaultValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
  const value = useSyncExternalStore(
    (cb) => storage.subscribe(key, cb),
    () => storage.get(key, defaultValue)
  );

  const setValue = (newValue: T | ((prev: T) => T)) => {
    if (typeof newValue === "function") {
      const current = storage.get(key, defaultValue);
      storage.set(key, (newValue as (prev: T) => T)(current));
    } else {
      storage.set(key, newValue);
    }
  };

  return [value, setValue];
}
