import type { ISODate } from "./types";

export type BalanceEntry = {
  date: ISODate;
  balance: number;
  time?: string; // 👈 NY
  label?: string;
};

const HISTORY_KEY = "hm_history_v1";

function todayISO(): ISODate {
  return new Date().toISOString().slice(0, 10) as ISODate;
}

export function loadHistory(): BalanceEntry[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function addHistoryEntry(entry: {
  balance: number;
  date: ISODate;
  time?: string;
}): BalanceEntry[] {
  const history = loadHistory();
const today = entry.date;

// Finn eksisterende i dag
const existingIndex = history.findIndex((h) => h.date === today);

let updated: BalanceEntry[];

if (existingIndex >= 0) {
  // Oppdater eksisterende
  updated = [...history];
  updated[existingIndex] = {
    ...updated[existingIndex],
    balance: entry.balance,
    time: entry.time,
  };
} else {
  const isFirst = history.length === 0;

  const newEntry: BalanceEntry = {
    date: entry.date,
    balance: entry.balance,
    time: entry.time,
    label: isFirst ? "Startsaldo etter lønn" : undefined,
  };

  updated = [newEntry, ...history];
}

localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
return updated;
}


export function clearHistory() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(HISTORY_KEY);
}
