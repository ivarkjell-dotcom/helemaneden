import type { BudgetSettings, ISODate } from "../types";

export type StoredState = BudgetSettings & {
  currentBalance: number;
};

export type StorageAdapter = {
  load(): StoredState | null;
  save(next: StoredState): void;
  clear(): void;
};

export type PartialStoredState = Partial<StoredState>;

export function isISODate(value: unknown): value is ISODate {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value);
}
