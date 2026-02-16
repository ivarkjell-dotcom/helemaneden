// /lib/types.ts
// --------------------------------------------------
// Globale typer for HeleMåneden budsjettmotor v1
// --------------------------------------------------

export type ISODate = `${number}-${number}-${number}`;

export type BudgetMode =
  | "normal"
  | "merged"        // ← lagt til (viktig!)
  | "ahead"
  | "behind"
  | "on-track"
  | "period-ended";

export type BudgetInputs = {
  monthStartDate: ISODate;
  nextPayday: ISODate;
  todayISO: ISODate;

  monthStartBalance: number; // saldo ved lønn
  currentBalance: number;    // saldo i dag
};

export type BudgetResult = {
  totalDays: number;
  daysElapsed: number;
  remainingDays: number;

  plannedDaily: number;
  safeDaily: number;
  safeWeek: number;

  expectedBalanceNow: number;
  delta: number;

  mode: BudgetMode;
};
