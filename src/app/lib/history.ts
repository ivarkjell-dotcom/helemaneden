import type { ISODate } from "./types";

export type BalanceEntry = {
  date: ISODate;
  balance: number;
  label?: string; // 👈 ny (for startsaldo)
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

export function addHistoryEntry(balance: number): BalanceEntry[] {
  const history = loadHistory();
  const today = todayISO();

  // 🔹 Finn om det allerede finnes en post i dag
  const existingIndex = history.findIndex((h) => h.date === today);

  let updated: BalanceEntry[];

  if (existingIndex >= 0) {
    // A) Overskriv dagens verdi (ikke lag ny)
    updated = [...history];
    updated[existingIndex] = {
      ...updated[existingIndex],
      balance,
    };
  } else {
    // B) Første dag = startsaldo
    const isFirst = history.length === 0;

    const entry: BalanceEntry = {
      date: today,
      balance,
      label: isFirst ? "Startsaldo etter lønn" : undefined,
    };

    updated = [entry, ...history];
  }

  localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  return updated;
}


export function clearHistory() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(HISTORY_KEY);
}
