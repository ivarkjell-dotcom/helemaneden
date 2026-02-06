import { STORAGE_KEYS } from "../constants";
import type { StorageAdapter, StoredState } from "./types";
import { isISODate } from "./types";

function readNumber(key: string): number | null {
  const raw = window.localStorage.getItem(key);
  if (raw == null) return null;
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
}

function readString(key: string): string | null {
  const raw = window.localStorage.getItem(key);
  return raw ?? null;
}

function write(key: string, value: string) {
  window.localStorage.setItem(key, value);
}

export const localStorageAdapter: StorageAdapter = {
  load(): StoredState | null {
    try {
      const monthStartBalance = readNumber(STORAGE_KEYS.monthStartBalance);
      const currentBalance = readNumber(STORAGE_KEYS.currentBalance);
      const monthStartDate = readString(STORAGE_KEYS.monthStartDate);
      const nextPayday = readString(STORAGE_KEYS.nextPayday);

      if (
        monthStartBalance == null ||
        currentBalance == null ||
        !monthStartDate ||
        !nextPayday ||
        !isISODate(monthStartDate) ||
        !isISODate(nextPayday)
      ) {
        return null;
      }

      return {
        monthStartBalance,
        monthStartDate,
        nextPayday,
        currentBalance,
      };
    } catch {
      return null;
    }
  },

  save(next: StoredState) {
    try {
      write(STORAGE_KEYS.monthStartBalance, String(next.monthStartBalance));
      write(STORAGE_KEYS.monthStartDate, next.monthStartDate);
      write(STORAGE_KEYS.nextPayday, next.nextPayday);
      write(STORAGE_KEYS.currentBalance, String(next.currentBalance));
    } catch {
      // ignorer i MVP
    }
  },

  clear() {
    try {
      window.localStorage.removeItem(STORAGE_KEYS.monthStartBalance);
      window.localStorage.removeItem(STORAGE_KEYS.monthStartDate);
      window.localStorage.removeItem(STORAGE_KEYS.nextPayday);
      window.localStorage.removeItem(STORAGE_KEYS.currentBalance);
    } catch {
      // ignorer i MVP
    }
  },
};

/**
 * TODO (Supabase):
 * - Lag `app/lib/storage/supabase.ts` som implementerer StorageAdapter
 * - Bruk Auth + RLS, og lagre settings per bruker
 * - Behold samme interface slik at UI/budget.ts ikke endres
 */
